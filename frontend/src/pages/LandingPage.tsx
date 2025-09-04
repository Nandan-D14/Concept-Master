import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Brain, MessageSquare, BookOpen, Award, Lightbulb, GraduationCap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="text-center max-w-4xl p-8 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter text-primary">
            Unlock Your Potential with AI-Powered Learning
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Concept Master is your personal AI tutor, designed to simplify complex topics, solve doubts instantly, and generate personalized study plans for students from Class 1 to 12.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/login">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-12">How Concept Master Empowers You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <Brain className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl font-semibold">AI-Powered Explanations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">Get complex concepts simplified into easy-to-understand language with real-life examples and key takeaways.</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <MessageSquare className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl font-semibold">Instant Doubt Solving</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">Stuck on a problem? Our AI tutor provides step-by-step solutions and similar practice questions instantly.</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <BookOpen className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl font-semibold">Personalized Study Plans</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">Receive customized study schedules and topic priorities based on your progress and upcoming exams.</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <Award className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl font-semibold">Adaptive Test Generation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">Generate practice tests tailored to your subject, chapter, and difficulty level for effective preparation.</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <Lightbulb className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl font-semibold">PYQ Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">Analyze Previous Year Questions to identify important topics, difficulty trends, and scoring patterns.</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <GraduationCap className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl font-semibold">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">Monitor your learning journey with detailed progress reports, XP points, and achievement badges.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-4xl font-bold">Ready to Transform Your Learning?</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Join thousands of students who are achieving academic excellence with Concept Master. Sign up today and experience the future of education.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-4">
            <Link to="/register">Start Learning Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card text-muted-foreground text-center text-sm">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Concept Master. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;