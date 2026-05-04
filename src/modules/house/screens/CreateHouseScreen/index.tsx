import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';

import { useCreateHouse } from '../../hooks/useCreateHouse';
import { useHousesList } from '../../hooks/useHousesList';
import { HouseNameForm } from '../../components/HouseNameForm';
import { CreateHouseErrorScreen } from '../../components/CreateHouseErrorScreen';
import { createHouseSchema } from '../../domain/validators/createHouse.validator';
import { CREATE_HOUSE_SCREEN_LABELS } from '../../constants/house.constants';
import { errorMessages } from '../../components/HouseNameForm/constants';
import { HouseCoordinator } from '../../coordinator/HouseCoordinator';
import type { CreateHouseInput } from '../../domain/validators/createHouse.validator';
import type { PointsExpirationType } from '../../types/house.types';
import { styles } from './styles';

export const CreateHouseScreen: React.FC = () => {
  const [formData, setFormData] = useState<Partial<CreateHouseInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmissionError, setHasSubmissionError] = useState(false);
  const { mutate: createHouse, isPending, error } = useCreateHouse();
  const { data: houses } = useHousesList();
  const hasExistingHouses = (houses?.length ?? 0) > 0;

  const handleSubmit = () => {
    const result = createHouseSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const nameError = fieldErrors.name?.[0]
        ? errorMessages[fieldErrors.name[0]]
        : undefined;
      const descriptionError = fieldErrors.description?.[0]
        ? errorMessages[fieldErrors.description[0]]
        : undefined;
      const pointsExpirationTypeError = fieldErrors.pointsExpirationType?.[0]
        ? errorMessages[fieldErrors.pointsExpirationType[0]]
        : undefined;
      const pointsExpirationCustomDateError = fieldErrors.pointsExpirationCustomDate?.[0]
        ? errorMessages[fieldErrors.pointsExpirationCustomDate[0]]
        : undefined;

      setErrors({
        name: nameError ?? '',
        description: descriptionError ?? '',
        pointsExpirationType: pointsExpirationTypeError ?? '',
        pointsExpirationCustomDate: pointsExpirationCustomDateError ?? '',
      });

      return;
    }
    setErrors({});
    setHasSubmissionError(false);
    createHouse(result.data, {
      onError: () => {
        setHasSubmissionError(true);
      },
    });
  };

  const handleRetry = () => {
    setHasSubmissionError(false);
    handleSubmit();
  };

  if (hasSubmissionError && error) {
    return (
      <CreateHouseErrorScreen
        error={error}
        onRetry={handleRetry}
        isRetrying={isPending}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HouseNameForm
        name={formData.name ?? ''}
        onNameChange={name => setFormData({ ...formData, name })}
        nameError={errors.name}
        description={formData.description ?? ''}
        onDescriptionChange={description => setFormData({ ...formData, description })}
        descriptionError={errors.description}
        pointsExpirationType={
          formData.pointsExpirationType as PointsExpirationType | undefined
        }
        onPointsExpirationTypeChange={type =>
          setFormData({ ...formData, pointsExpirationType: type })
        }
        pointsExpirationError={errors.pointsExpirationType}
        customDate={formData.pointsExpirationCustomDate ?? null}
        onCustomDateChange={date =>
          setFormData({ ...formData, pointsExpirationCustomDate: date })
        }
        customDateError={errors.pointsExpirationCustomDate}
        isDisabled={isPending}
      />
      <Button onPress={handleSubmit} isDisabled={isPending} style={styles.submitButton}>
        {isPending ? (
          <ButtonSpinner />
        ) : (
          <ButtonText>{CREATE_HOUSE_SCREEN_LABELS.CREATE_BUTTON}</ButtonText>
        )}
      </Button>
      {hasExistingHouses && (
        <Button
          variant="outline"
          action="secondary"
          onPress={() => HouseCoordinator.goBack()}
          isDisabled={isPending}
          style={styles.cancelButton}
        >
          <ButtonText>{CREATE_HOUSE_SCREEN_LABELS.CANCEL_BUTTON}</ButtonText>
        </Button>
      )}
    </ScrollView>
  );
};
