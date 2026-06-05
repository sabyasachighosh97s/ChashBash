import React, { useMemo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
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
import { CustomToast } from '@components/Toast';
import Headline from '@components/common/Headline';
import Paragraph from '@components/common/Paragraph';
import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';

// const schema = z.object({
//   email: z.string().min(1, 'Email required').email('Invalid email address'),
//   name: z.string().min(1, 'Name required'),
//   aaa: z.string().min(1, 'Please select fruit'),
//   bbb: z.string().min(1, 'Please select fruit'),
// });
const schema = z.object({
  email: z.string().min(1, 'Email required').email('Invalid email address'),

  name: z.string().min(4, 'Name must be at least 4 characters'),

  fruit1: z.string().min(1, 'Please select fruit'),

  fruit2: z.string().min(1, 'Please select fruit'),
});
 const HomeScreen = () => {
  const theme = useTheme();

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors, touchedFields, dirtyFields, isValid },
  // } = useForm({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     email: '',
  //     aaa: '',
  //     bbb: '',
  //     name: '',
  //   },
  //   mode: 'onChange', // This will trigger validation on change
  //   reValidateMode: 'onChange', // Re-validate on change
  // });
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

  const onSubmit = data => {
    console.log(data);
    CustomToast.success('Form submitted');
  };
  const fruitOptions = useMemo(
    () => [
      {
        label: 'Apple',
        value: 'apple',
      },
      {
        label: 'Mango',
        value: 'mango',
      },
    ],
    [],
  );
  return (
    <BackgroundImage source={backgroundImage}>
      <Container>
        <CustomStatusBar />
        <CustomAppBar
          title="Dashboard"
          onMenuPress={() => {}}
          onSearchPress={() => {}}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <CustomCard>
            <Card.Content>
              <Headline>Welcome</Headline>
              <Paragraph
                variant="body"
                style={{
                  color: theme.colors.onSurface,
                }}
              >
                Your content here
              </Paragraph>

              {/* <Input
                name="email"
                labelText="Email"
                placeholderText="Enter email"
                control={control}
                errors={errors}
                touchedFields={touchedFields}
                dirtyFields={dirtyFields}
                isValid={isValid}
              />

              <Input
                name="name"
                labelText="name"
                placeholderText="Enter name"
                control={control}
                errors={errors}
                touchedFields={touchedFields}
                dirtyFields={dirtyFields}
                isValid={isValid}
              /> */}
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
              <FormdownInput
                control={control}
                name="fruit1"
                labelText="Fruit"
                data={fruitOptions}
                error={errors.fruit1}
              />
              <FormdownInput
                control={control}
                name="fruit2"
                labelText="Fruit2"
                data={fruitOptions}
                error={errors.fruit2}
              />
            
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </Card.Actions>
          </CustomCard>
        </ScrollView>
      </Container>
    </BackgroundImage>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    paddingTop: 8,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
});
