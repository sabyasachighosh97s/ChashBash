import React from 'react';
import { View, Button } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import FormInput from '@components/forms/FormInput';
import Input from '@components/forms/Input';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email required')
    .email('Invalid email address'),

  name: z
    .string()
    .min(4, 'Name must be at least 4 characters'),

  fruit1: z.string().min(1, 'Please select fruit'),

  fruit2: z.string().min(1, 'Please select fruit'),
});

export default function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      email: '',
      name: '',
      fruit1: '',
      fruit2: '',
    },

    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = (data:any) => {
    console.log(data);
  };

  return (
    <PaperProvider>
      <View style={{ padding: 16 }}>
        <FormInput
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          control={control}
          name="name"
          label="Name"
          error={errors.name}
        />
<Input
  control={control}
  name="email"
  labelText="Email"
  placeholderText="Enter email"
  keyboardType="email-address"
  errors={errors}
/>
        <Button
          title="Submit"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </PaperProvider>
  );
}
