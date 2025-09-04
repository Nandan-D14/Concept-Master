import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../store';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  class: number;
  board: 'CBSE' | 'ICSE' | 'State';
}

const schema = yup.object().shape({
  name: yup.string().min(2).max(50).required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  class: yup.number().min(1, 'Class must be between 1 and 12').max(12, 'Class must be between 1 and 12').required('Class is required'),
  board: yup.mixed<'CBSE' | 'ICSE' | 'State'>().oneOf(['CBSE', 'ICSE', 'State']).required('Board is required'),
});

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const selectedBoard = watch('board');
  const selectedClass = watch('class');

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      if (response.data.success) {
        const { token, user } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Registration failed.');
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join us to start your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                {...register('name')}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register('email')}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register('password')}
                disabled={loading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="class" className="sr-only">Class</label>
              <Select
                onValueChange={(value) => setValue('class', parseInt(value))}
                value={selectedClass ? String(selectedClass) : ''}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
                    <SelectItem key={cls} value={String(cls)}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>}
            </div>
            <div>
              <label htmlFor="board" className="sr-only">Board</label>
              <Select
                onValueChange={(value: 'CBSE' | 'ICSE' | 'State') => setValue('board', value)}
                value={selectedBoard || ''}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="State">State Board</SelectItem>
                </SelectContent>
              </Select>
              {errors.board && <p className="text-red-500 text-sm mt-1">{errors.board.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
