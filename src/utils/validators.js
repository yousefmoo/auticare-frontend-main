/**
 * Validation Utilities
 * Helper functions for form and data validation
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Phone number validation (simple)
 */
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10,15}$/, 'Invalid phone number');

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['doctor', 'therapist', 'parent']),
  phone: phoneSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Signup form validation schema
 */
const baseSignupSchema = z.object({
  role: z.enum(['doctor', 'therapist', 'parent']),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: phoneSchema,
  specialization: z.string().optional(),
  clinicHospital: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  therapyType: z.string().optional(),
  experienceYears: z.string().optional(),
  childName: z.string().optional(),
  childAge: z.string().optional(),
  behavior: z.string().optional(),
});

export const signupSchema = baseSignupSchema.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }

  if (data.role === 'doctor') {
    if (!data.specialization?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Specialization is required',
        path: ['specialization'],
      });
    }
    if (!data.clinicHospital?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Clinic or hospital is required',
        path: ['clinicHospital'],
      });
    }
    if (!data.yearsOfExperience?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Years of experience is required',
        path: ['yearsOfExperience'],
      });
    } else if (!/^\d+$/.test(data.yearsOfExperience) || Number(data.yearsOfExperience) > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid number of years',
        path: ['yearsOfExperience'],
      });
    }
  }

  if (data.role === 'therapist') {
    if (!data.therapyType?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Therapy type is required',
        path: ['therapyType'],
      });
    }
    if (!data.experienceYears?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Experience years is required',
        path: ['experienceYears'],
      });
    } else if (!/^\d+$/.test(data.experienceYears) || Number(data.experienceYears) > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid number of years',
        path: ['experienceYears'],
      });
    }
  }

  if (data.role === 'parent') {
    if (!data.childName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Child name is required',
        path: ['childName'],
      });
    }
    if (!data.childAge?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Child age is required',
        path: ['childAge'],
      });
    } else if (!/^\d+$/.test(data.childAge) || Number(data.childAge) < 1 || Number(data.childAge) > 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid child age',
        path: ['childAge'],
      });
    }
    if (!data.behavior?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Behavior details are required',
        path: ['behavior'],
      });
    }
  }
});

/**
 * Daily feedback form validation schema
 */
export const feedbackSchema = z.object({
  activityId: z.string().min(1, 'Activity is required'),
  status: z.enum(['completed', 'refused', 'in_progress', 'skipped']),
  notes: z.string().optional(),
  duration: z.number().min(0).optional(),
  childResponse: z.string().optional(),
  challenges: z.string().optional(),
  date: z.string(),
});

/**
 * Treatment plan validation schema
 */
export const treatmentPlanSchema = z.object({
  childId: z.string().min(1, 'Child selection is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  startDate: z.string(),
  endDate: z.string(),
  therapyType: z.enum(['speech', 'behavioral', 'occupational', 'physical']),
  frequency: z.string(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

/**
 * Therapy note validation schema
 */
export const therapyNoteSchema = z.object({
  sessionDate: z.string(),
  childId: z.string().min(1, 'Child is required'),
  activityId: z.string().optional(),
  observations: z.string().min(10, 'Observations must be at least 10 characters'),
  progress: z.string().optional(),
  recommendations: z.string().optional(),
  parentGuidance: z.string().optional(),
  nextSteps: z.string().optional(),
});

/**
 * Message validation schema
 */
export const messageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional(),
  content: z.string().min(1, 'Message content is required'),
});

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required fields
 * @param {object} data - Data object to validate
 * @param {array} requiredFields - Array of required field names
 * @returns {object} Validation result { isValid, errors }
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize user input (basic XSS protection)
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
