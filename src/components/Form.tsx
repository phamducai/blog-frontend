'use client';

import React from 'react';
import { useForm, FormProvider, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { twMerge } from 'tailwind-merge';

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  className?: string;
  defaultValues?: DefaultValues<T>;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  className,
  defaultValues,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit as any)}
        className={twMerge('space-y-4', className)}
      >
        {children(methods)}
      </form>
    </FormProvider>
  );
} 