import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, IconButton, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';
import { Paragraph } from '@components/ui';

const schema = z.object({
  crops: z.array(
    z.object({
      cropType: z.string().min(1, 'Crop Type is required'),
      cropName: z.string().min(1, 'Crop Name is required'),
      cropVariety: z.string().min(1, 'Crop Variety is required'),
      area: z.string().min(1, 'Area is required'),
    }),
  ),
});

type FormData = z.infer<typeof schema>;

const CropRegistrationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const registrationData = route.params?.registrationData;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      crops: [
        {
          cropType: '',
          cropName: '',
          cropVariety: '',
          area: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'crops',
  });

  /*
  ===========================================================
  Dummy Data
  Replace with API later
  ===========================================================
  */

  const cropTypeList = useMemo(
    () => [
      {
        label: 'Vegetable',
        value: 'vegetable',
      },
      {
        label: 'Fruit',
        value: 'fruit',
      },
      {
        label: 'Grain',
        value: 'grain',
      },
    ],
    [],
  );

  const cropNameMaster = [
    {
      cropType: 'vegetable',
      label: 'Potato',
      value: 'potato',
    },
    {
      cropType: 'vegetable',
      label: 'Tomato',
      value: 'tomato',
    },
    {
      cropType: 'fruit',
      label: 'Mango',
      value: 'mango',
    },
    {
      cropType: 'fruit',
      label: 'Banana',
      value: 'banana',
    },
    {
      cropType: 'grain',
      label: 'Rice',
      value: 'rice',
    },
    {
      cropType: 'grain',
      label: 'Wheat',
      value: 'wheat',
    },
  ];

  const varietyMaster = [
    {
      crop: 'potato',
      label: 'Jyoti',
      value: 'jyoti',
    },
    {
      crop: 'potato',
      label: 'Kufri',
      value: 'kufri',
    },
    {
      crop: 'tomato',
      label: 'Hybrid',
      value: 'hybrid',
    },
    {
      crop: 'mango',
      label: 'Himsagar',
      value: 'himsagar',
    },
    {
      crop: 'banana',
      label: 'G9',
      value: 'g9',
    },
    {
      crop: 'rice',
      label: 'Swarna',
      value: 'swarna',
    },
    {
      crop: 'wheat',
      label: 'HD-2967',
      value: 'hd2967',
    },
  ];

  const onSubmit = (data: FormData) => {
    console.log('Farmer Registration', registrationData);
    console.log('Crop Registration', data);

    // API Call Later
  };
  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomCard>
          <Card.Content>
            <View style={styles.headerContainer}>
              <Paragraph
                style={[
                  styles.title,
                  {
                    color: theme.colors.primary,
                  },
                ]}
              >
                Crop Registration
              </Paragraph>

              <Paragraph
                style={[
                  styles.subTitle,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Add one or more crops
              </Paragraph>
            </View>

            {fields.map((item, index) => {
              const selectedCropType = watch(`crops.${index}.cropType`);

              const selectedCropName = watch(`crops.${index}.cropName`);

              const cropNameOptions = cropNameMaster
                .filter(crop => crop.cropType === selectedCropType)
                .map(crop => ({
                  label: crop.label,
                  value: crop.value,
                }));

              const varietyOptions = varietyMaster
                .filter(variety => variety.crop === selectedCropName)
                .map(variety => ({
                  label: variety.label,
                  value: variety.value,
                }));

              return (
                <Card key={item.id} mode="outlined" style={styles.cropCard}>
                  <Card.Title
                    title={`Crop ${index + 1}`}
                    right={() =>
                      fields.length > 1 ? (
                        <IconButton
                          icon="delete-outline"
                          iconColor={theme.colors.error}
                          onPress={() => remove(index)}
                        />
                      ) : null
                    }
                  />

                  <Card.Content>
                    <FormdownInput
                      control={control}
                      name={`crops.${index}.cropType`}
                      labelText="Crop Type"
                      data={cropTypeList}
                      error={errors.crops?.[index]?.cropType}
                    />

                    <FormdownInput
                      control={control}
                      name={`crops.${index}.cropName`}
                      labelText="Crop Name"
                      data={cropNameOptions}
                      disabled={!selectedCropType}
                      error={errors.crops?.[index]?.cropName}
                    />

                    <FormdownInput
                      control={control}
                      name={`crops.${index}.cropVariety`}
                      labelText="Crop Variety"
                      data={varietyOptions}
                      disabled={!selectedCropName}
                      error={errors.crops?.[index]?.cropVariety}
                    />

                    <FormInput
                      control={control}
                      name={`crops.${index}.area`}
                      label="Area (Bigha)"
                      keyboardType="decimal-pad"
                      error={errors.crops?.[index]?.area}
                    />
                  </Card.Content>
                </Card>
              );
            })}

            <Button
              mode="outlined"
              icon="plus"
              style={styles.addButton}
              onPress={() =>
                append({
                  cropType: '',
                  cropName: '',
                  cropVariety: '',
                  area: '',
                })
              }
            >
              Add Another Crop
            </Button>
          </Card.Content>

          <Card.Actions style={styles.actionContainer}>
            <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              Submit Registration
            </Button>
          </Card.Actions>
        </CustomCard>
      </ScrollView>
    </Container>
  );
};

export default CropRegistrationScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  subTitle: {
    marginTop: 6,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  cropCard: {
    marginBottom: 20,
    borderRadius: 12,
  },

  addButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 10,
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  submitButton: {
    borderRadius: 10,
  },
});
