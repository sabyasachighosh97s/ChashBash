import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { BackgroundImage } from '../components/common/BackgroundImage';
import { CustomStatusBar } from '../components/common/CustomStatusBar';
import { CustomAppBar } from '../components/common/CustomAppBar';
import backgroundImage from '../assets/images/background.jpg';
import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import Input from '@components/forms/Input';
import DropdownInput from '@components/forms/DropdownInput';
import { CustomToast } from '@components/Toast';
import Headline from '@components/common/Headline';
import Paragraph from '@components/common/Paragraph';

const schema = z.object({
  email: z.string().min(1, 'Email required').email('Invalid email address'),
  name: z.string().min(4, 'Name must be at least 4 characters'),
  fruit1: z.string().min(1, 'Please select fruit'),
  fruit2: z.string().min(1, 'Please select fruit'),
});

// Static data outside component to prevent recreation
const FRUIT_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Mango', value: 'mango' },
];

export const HomeScreen = () => {
  const theme = useTheme();
  const submitButtonRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields, isValid },
    watch,
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

  // Watch form values (optional - for debugging)
  const formValues = watch();

  const onSubmit = useCallback(async (data) => {
    console.log('Form Data:', data);
    CustomToast.success('Form submitted successfully!');
  }, []);

  const onError = useCallback((errors) => {
    console.log('Form Errors:', errors);
    CustomToast.error('Please fix the errors before submitting');
  }, []);

  // Memoize common props to prevent unnecessary re-renders
  const formProps = useMemo(() => ({
    control,
    errors,
    touchedFields,
    dirtyFields,
    isValid,
  }), [control, errors, touchedFields, dirtyFields, isValid]);

  // Memoize fruit options
  const fruitOptions = useMemo(() => FRUIT_OPTIONS, []);

  return (
    <BackgroundImage source={backgroundImage}>
      <Container>
        <CustomStatusBar />
        <CustomAppBar
          title="Dashboard"
          onMenuPress={() => {}}
          onSearchPress={() => {}}
        />
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CustomCard>
            <Card.Content>
              <Headline>Welcome</Headline>
              <Paragraph
                variant="body"
                style={{
                  color: theme.colors.onSurface,
                  marginBottom: 16,
                }}
              >
                Please fill in the form below
              </Paragraph>

              <Input
                name="email"
                labelText="Email"
                placeholderText="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                {...formProps}
              />

              <Input
                name="name"
                labelText="Name"
                placeholderText="Enter your name"
                {...formProps}
              />

              <DropdownInput
                name="fruit1"
                labelText="Select First Fruit"
                data={fruitOptions}
                {...formProps}
              />
              
              <DropdownInput
                name="fruit2"
                labelText="Select Second Fruit"
                data={fruitOptions}
                {...formProps}
              />
            </Card.Content>
            
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="contained" 
                onPress={handleSubmit(onSubmit, onError)}
                disabled={!isValid}
                style={styles.submitButton}
                labelStyle={styles.buttonLabel}
              >
                Submit Form
              </Button>
            </Card.Actions>
          </CustomCard>
        </ScrollView>
      </Container>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 40,
  },
  cardActions: {
    padding: 16,
    justifyContent: 'center',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});