import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, User, Mail, Lock, Phone, Calendar, MapPin } from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  validationRules?: ValidationRule[];
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  icon?: React.ReactNode;
  helperText?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value: controlledValue,
  onChange,
  validationRules = [],
  required = false,
  disabled = false,
  maxLength,
  rows = 4,
  icon,
  helperText
}) => {
  const [value, setValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    validateInput(value);
  }, [value, validationRules]);

  const validateInput = (inputValue: string) => {
    const errors: string[] = [];
    
    if (required && !inputValue.trim()) {
      errors.push(`${label} is required`);
    }

    validationRules.forEach(rule => {
      if (inputValue && !rule.test(inputValue)) {
        errors.push(rule.message);
      }
    });

    setValidationErrors(errors);
    setIsValid(errors.length === 0 && (!required || inputValue.trim().length > 0));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
    if (!hasBeenTouched) {
      setHasBeenTouched(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getStatusIcon = () => {
    if (!hasBeenTouched || !value) return null;
    
    if (validationErrors.length > 0) {
      return <X className="w-5 h-5 text-red-500" />;
    }
    
    if (isValid) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    
    return null;
  };

  const getBorderColor = () => {
    if (!hasBeenTouched) {
      return isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300';
    }
    
    if (validationErrors.length > 0) {
      return 'border-red-500 ring-2 ring-red-500/20';
    }
    
    if (isValid) {
      return 'border-green-500 ring-2 ring-green-500/20';
    }
    
    return isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300';
  };

  const commonProps = {
    ref: inputRef as any,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    maxLength,
    placeholder,
    className: `w-full px-4 py-3 ${icon ? 'pl-12' : ''} ${
      type === 'password' ? 'pr-20' : getStatusIcon() ? 'pr-12' : 'pr-4'
    } border rounded-xl transition-all duration-200 focus:outline-none bg-white/80 backdrop-blur-sm ${getBorderColor()} ${
      disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'text-slate-900'
    } placeholder-slate-400`
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10">
            {icon}
          </div>
        )}

        {/* Input Field */}
        {type === 'textarea' ? (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${commonProps.className} resize-none`}
          />
        ) : (
          <input
            {...commonProps}
            type={getInputType()}
          />
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 z-10"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Status Icon */}
        {getStatusIcon() && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            {getStatusIcon()}
          </div>
        )}

        {/* Character Count */}
        {maxLength && (
          <div className="absolute right-4 bottom-2 text-xs text-slate-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !hasBeenTouched && (
        <p className="text-sm text-slate-500 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{helperText}</span>
        </p>
      )}

      {/* Validation Messages */}
      {hasBeenTouched && validationErrors.length > 0 && (
        <div className="space-y-1">
          {validationErrors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center space-x-2 animate-slide-in">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </p>
          ))}
        </div>
      )}

      {/* Success Message */}
      {hasBeenTouched && isValid && value && (
        <p className="text-sm text-green-600 flex items-center space-x-2 animate-slide-in">
          <Check className="w-4 h-4" />
          <span>Looks good!</span>
        </p>
      )}
    </div>
  );
};

// Demo Component
const InputFieldDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    address: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthDate: '',
        address: '',
        bio: ''
      });
    }, 3000);
  };

  const emailValidation: ValidationRule[] = [
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    }
  ];

  const passwordValidation: ValidationRule[] = [
    {
      test: (value) => value.length >= 8,
      message: 'Password must be at least 8 characters long'
    },
    {
      test: (value) => /[A-Z]/.test(value),
      message: 'Password must contain at least one uppercase letter'
    },
    {
      test: (value) => /[a-z]/.test(value),
      message: 'Password must contain at least one lowercase letter'
    },
    {
      test: (value) => /\d/.test(value),
      message: 'Password must contain at least one number'
    }
  ];

  const confirmPasswordValidation: ValidationRule[] = [
    {
      test: (value) => value === formData.password,
      message: 'Passwords do not match'
    }
  ];

  const phoneValidation: ValidationRule[] = [
    {
      test: (value) => /^\+?[\d\s\-\(\)]{10,}$/.test(value),
      message: 'Please enter a valid phone number'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Form Submitted Successfully!</h3>
          <p className="text-slate-600">Thank you for testing our input field component.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h3 className="text-2xl font-bold text-white mb-2">User Registration Form</h3>
          <p className="text-blue-100">Experience our advanced input field component with real-time validation</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              required
              icon={<User className="w-5 h-5" />}
              helperText="Your given name as it appears on official documents"
            />
            <InputField
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              required
              icon={<User className="w-5 h-5" />}
              helperText="Your family name or surname"
            />
          </div>

          {/* Email */}
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange('email')}
            validationRules={emailValidation}
            required
            icon={<Mail className="w-5 h-5" />}
            helperText="We'll use this to send you important updates"
          />

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange('password')}
              validationRules={passwordValidation}
              required
              icon={<Lock className="w-5 h-5" />}
              helperText="Must be at least 8 characters with mixed case, numbers"
            />
            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              validationRules={confirmPasswordValidation}
              required
              icon={<Lock className="w-5 h-5" />}
              helperText="Re-enter your password to confirm"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              validationRules={phoneValidation}
              icon={<Phone className="w-5 h-5" />}
              helperText="Include country code for international numbers"
            />
            <InputField
              label="Date of Birth"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange('birthDate')}
              icon={<Calendar className="w-5 h-5" />}
              helperText="Used for age verification purposes"
            />
          </div>

          {/* Address */}
          <InputField
            label="Address"
            type="text"
            placeholder="Enter your full address"
            value={formData.address}
            onChange={handleInputChange('address')}
            maxLength={200}
            icon={<MapPin className="w-5 h-5" />}
            helperText="Street address, city, state, and postal code"
          />

          {/* Bio */}
          <InputField
            label="Bio"
            type="textarea"
            placeholder="Tell us a little about yourself..."
            value={formData.bio}
            onChange={handleInputChange('bio')}
            maxLength={500}
            rows={4}
            helperText="Optional: Share your interests, hobbies, or professional background"
          />

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputFieldDemo;