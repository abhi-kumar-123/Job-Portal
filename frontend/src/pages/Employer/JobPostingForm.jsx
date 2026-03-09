import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import {
  AlertCircle,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
  Send
} from 'lucide-react'

import { API_PATHS } from '../../utils/apiPaths'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'
import { JOB_TYPES, CATEGORIES } from '../../utils/data'
import InputField from '../../components/Input/InputField'
import SelectField from '../../components/Input/SelectField'
import TextareaField from '../../components/Input/TextareaField'
import JobPostingPreview from '../../components/Cards/JobPostingPreview'

const JobPostingForm = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: ""
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    //Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax
    }

    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobId ? "Job Updated Successfully" : "Job Posted Successfully"
        );

        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });

        navigate("/employer-dashboard");
        return;
      }

      console.error("Unexpected response : ", response)
      toast.error("Something went Wrong. Please try again.");
    } catch (error) {
      if (error.response?.data?.message) {
        console.error("API Error: ", error.response.data.message);
        toast.error(error.response.data.message)
      } else {
        console.error("Unexpected error :", error)
        toast.error("Failed to post/ update job. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }

  }

  //Form validation helper
  const validateForm = (formData) => {
    const errors = {}

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.category) {
      errors.category = "Please select a categor"
    }

    if (!formData.jobType) {
      errors.jobType = "Please select a job type"
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required"
    }

    if (!formData.requirements.trim()) {
      errors.requirements = "Job requirements are required"
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required"
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      errors.salary = "Maximum salary must be graeter than minimum salary"
    }
    return errors
  }

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await axiosInstance.get(
            API_PATHS.JOBS.GET_JOB_BY_ID(jobId)
          );

          const jobData = response.data;

          if (jobData) {
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              category: jobData.category,
              jobType: jobData.type,
              description: jobData.description,
              requirements: jobData.requirements,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
            })
          }
        } catch (error) {
          console.error("Error fetching job details.")
          if (error.response) {
            console.error("API Error:", error.response.data.message)
          }
        }
      }
    };
    fetchJobDetails();
  }, [jobId])

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0
  }

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu='post-job'>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white shadow-xl rounded-2xl p-6'>

            {/*             
            <div className='flex items-center justify-center mb-8'>
              <div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-white'>
                  Post a New Job
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className='group flex items-center space-x-2 px-6 py-3 text-sm font-medium  text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  <Eye className='h-4 w-4 transition-transform group-hover:-translate-x-1 ' />
                  <span>Preview</span>
                </button>
              </div>
            </div> */}


            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>

              <div>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-white'>
                  Post a New Job
                </h2>

                <p className='text-sm text-gray-600 mt-1'>
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className='group flex items-center space-x-2 px-6 py-3 text-sm font-medium  text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  <Eye className='h-4 w-4 transition-transform group-hover:-translate-x-1 ' />
                  <span>Preview</span>
                </button>
              </div>

            </div>



            <div className='space-y-6  '>
              {/* Job title */}
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />


              {/* Location & Remote */}
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0 space-y-4'>
                  <div className='flex-1'>
                    <InputField
                      label="Location"
                      id="location"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      error={errors.location}
                      required
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              {/* Category & Job Types */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <SelectField
                  label="Category"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  options={CATEGORIES}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                  icon={Users}
                />


                <SelectField
                  label="Job Type"
                  id="jobType"
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  options={JOB_TYPES}
                  placeholder="Select job type"
                  error={errors.jobType}
                  required
                  icon={Briefcase}
                />
              </div>

              {/* Description */}
              <TextareaField
                label="Job Description"
                id="description"
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                helperText="Include key responsibilities , day-to-day tasks, and what makes this role exciting"
                required
              />

              {/* Requiremensts */}
              <TextareaField
                label="Requiremensts"
                id="requirements"
                placeholder="List key qualifications and skills..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={errors.requirements}
                helperText="Include required skills, experience level, education and any preferred qualifications"
                required
              />

              {/* Salary Range */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Salary Range <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400' />
                    </div>

                    <input
                      type='number'
                      placeholder='Min'
                      min={0}
                      step={1000}
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-300'
                    />
                  </div>


                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='number'
                      placeholder='Max'
                      min={0}
                      step={1000}
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-300'
                    />
                  </div>
                </div>

                {errors.salary && (
                  <div className='flex items-center space-x-1 text-sm text-red-600'>
                    <AlertCircle className='h-4 w-4' />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}

              <div className='pt-2'>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className='w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed outline-none transition-colors duration-200
                 '
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Publishing Job...
                    </>
                  ) : (
                    <>
                      <Send className='h-5 w-5 mr-2' />
                      Publish to
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  // return (
  //   <DashboardLayout activeMenu='post-job'>
  //     <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
  //       <div className='max-w-4xl mx-auto'>
  //         <div className='bg-white shadow-xl rounded-2xl p-8'>

  //           {/* Header */}
  //           <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
  //             <div>
  //               <h2 className='text-2xl font-bold text-gray-900'>
  //                 Post a New Job
  //               </h2>
  //               <p className='text-sm text-gray-600 mt-1'>
  //                 Fill out the form below to create your job posting
  //               </p>
  //             </div>

  //             <button
  //               onClick={() => setIsPreview(true)}
  //               disabled={!isFormValid()}
  //               className='flex items-center space-x-2 px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 disabled:opacity-50'
  //             >
  //               <Eye className='h-4 w-4' />
  //               <span>Preview</span>
  //             </button>
  //           </div>

  //           {/* Form */}
  //           <div className='space-y-6'>

  //             <InputField
  //               label="Job Title"
  //               id="jobTitle"
  //               placeholder="e.g., Senior Frontend Developer"
  //               value={formData.jobTitle}
  //               onChange={(e) => handleInputChange("jobTitle", e.target.value)}
  //               error={errors.jobTitle}
  //               required
  //               icon={Briefcase}
  //             />

  //             <InputField
  //               label="Location"
  //               id="location"
  //               placeholder="e.g., New York, NY"
  //               value={formData.location}
  //               onChange={(e) => handleInputChange("location", e.target.value)}
  //               error={errors.location}
  //               required
  //               icon={MapPin}
  //             />

  //             {/* Category + Job Type */}
  //             <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
  //               <SelectField
  //                 label="Category"
  //                 id="category"
  //                 value={formData.category}
  //                 onChange={(e) => handleInputChange("category", e.target.value)}
  //                 options={CATEGORIES}
  //                 placeholder="Select a category"
  //                 error={errors.category}
  //                 required
  //                 icon={Users}
  //               />

  //               <SelectField
  //                 label="Job Type"
  //                 id="jobType"
  //                 value={formData.jobType}
  //                 onChange={(e) => handleInputChange("jobType", e.target.value)}
  //                 options={JOB_TYPES}
  //                 placeholder="Select job type"
  //                 error={errors.jobType}
  //                 required
  //                 icon={Briefcase}
  //               />
  //             </div>

  //             <TextareaField
  //               label="Job Description"
  //               id="description"
  //               placeholder="Describe the role and responsibilities..."
  //               value={formData.description}
  //               onChange={(e) => handleInputChange("description", e.target.value)}
  //               error={errors.description}
  //               helperText="Include responsibilities and day-to-day work"
  //               required
  //             />

  //             <TextareaField
  //               label="Requirements"
  //               id="requirements"
  //               placeholder="List key qualifications and skills..."
  //               value={formData.requirements}
  //               onChange={(e) => handleInputChange("requirements", e.target.value)}
  //               error={errors.requirements}
  //               helperText="Include required skills and experience"
  //               required
  //             />

  //             {/* Salary */}
  //             <div className='space-y-2'>
  //               <label className='block text-sm font-medium text-gray-700'>
  //                 Salary Range <span className='text-red-500'>*</span>
  //               </label>

  //               <div className='grid grid-cols-2 gap-4'>
  //                 <div className='relative'>
  //                   <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
  //                   <input
  //                     type='number'
  //                     placeholder='Minimum Salary'
  //                     value={formData.salaryMin}
  //                     onChange={(e) => handleInputChange("salaryMin", e.target.value)}
  //                     className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  //                   />
  //                 </div>

  //                 <div className='relative'>
  //                   <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
  //                   <input
  //                     type='number'
  //                     placeholder='Maximum Salary'
  //                     value={formData.salaryMax}
  //                     onChange={(e) => handleInputChange("salaryMax", e.target.value)}
  //                     className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  //                   />
  //                 </div>
  //               </div>

  //               {errors.salary && (
  //                 <div className='flex items-center gap-1 text-sm text-red-600'>
  //                   <AlertCircle className='h-4 w-4' />
  //                   <span>{errors.salary}</span>
  //                 </div>
  //               )}
  //             </div>

  //             {/* Submit */}
  //             <div className='pt-4'>
  //               <button
  //                 onClick={handleSubmit}
  //                 disabled={isSubmitting || !isFormValid()}
  //                 className='w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300'
  //               >
  //                 {isSubmitting ? (
  //                   <>
  //                     <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
  //                     Publishing Job...
  //                   </>
  //                 ) : (
  //                   <>
  //                     <Send className='h-5 w-5' />
  //                     Publish Job
  //                   </>
  //                 )}
  //               </button>
  //             </div>

  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </DashboardLayout>
  // )

}

export default JobPostingForm
