import React from 'react';
import Image from 'next/image';
import { Card } from '../../components/common/Card';
import { LoginForm } from '../../components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image 
            src="/img/MBTechLabsLogo.png" 
            alt="MB Tech Labs Logo" 
            width={60}
            height={60}
            className="h-14 w-auto mb-4 object-contain drop-shadow-[0_0_10px_rgba(0,207,255,0.5)] hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(0,207,255,0.8)] transition-all duration-300"
          />
          <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">MB Tech Labs</h1>
          <p className="text-[var(--text-secondary)]">Sign in to your workspace</p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
}

