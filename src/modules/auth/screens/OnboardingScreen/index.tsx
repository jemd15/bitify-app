import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { useUploadAvatar } from '@modules/account/hooks/useUploadAvatar';
import { useUpdateProfile } from '@modules/account/hooks/useUpdateProfile';
import { useEnsureUserPreferences } from '@modules/account/hooks/useEnsureUserPreferences';
import { OnboardingPersonalForm } from '@modules/auth/components/OnboardingPersonalForm';
import { HouseActionSelector } from '@modules/auth/components/HouseActionSelector';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';
import type { HouseAction } from '@modules/auth/components/HouseActionSelector/types';

import { styles } from './styles';
import { ONBOARDING_CONSTANTS } from './constants';

type OnboardingStep = 1 | 2;

export const OnboardingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { data: session } = useAuthSession();
  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { ensurePreferences } = useEnsureUserPreferences();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>();
  const [avatarType, setAvatarType] = useState<string | undefined>();
  const [selectedAction, setSelectedAction] = useState<HouseAction | undefined>();
  const [avatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata || {};
      const googleName = metadata.name || metadata.full_name || '';
      const googleAvatar = metadata.picture || metadata.avatar_url;

      setEmail(session.user.email || metadata.email || '');
      setFullName(googleName);
      setAvatarUri(googleAvatar);
    }
  }, [session]);

  const handlePersonalDataChange = (data: {
    email: string;
    fullName: string;
    avatarUri?: string;
    avatarBase64?: string;
    avatarType?: string;
  }) => {
    setEmail(data.email);
    setFullName(data.fullName);
    setAvatarUri(data.avatarUri);
    setAvatarBase64(data.avatarBase64);
    setAvatarType(data.avatarType);
  };
  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  const navigateAfterOnboarding = (action: HouseAction) => {
    if (action === 'create') {
      AuthCoordinator.navigateToCreateHouse();
    } else {
      AuthCoordinator.navigateToHome();
    }
  };
  const handleProfileUpdateError = (error: Error) => {
    console.error('Failed to update profile:', error);
  };
  const getAvatarUrl = async (): Promise<string | undefined> => {
    if (avatarBase64 && avatarUri && avatarType) {
      try {
        return await uploadAvatar({
          base64: avatarBase64,
          uri: avatarUri,
          type: avatarType,
        });
      } catch (error) {
        handleProfileUpdateError(error as Error);
        throw error;
      }
    }

    return avatarUrl;
  };
  const handleComplete = async () => {
    if (!selectedAction) {
      return;
    }

    try {
      const finalAvatarUrl = await getAvatarUrl();

      await ensurePreferences();

      await updateProfile({
        fullName: fullName || undefined,
        avatarUrl: finalAvatarUrl,
        userType: 'free',
      });

      navigateAfterOnboarding(selectedAction);
    } catch (error) {
      handleProfileUpdateError(error as Error);
    }
  };
  const canProceedFromStep1 = email.trim().length > 0;
  const canComplete = selectedAction !== undefined;
  const isProcessing = isUploadingAvatar || isUpdatingProfile;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{ONBOARDING_CONSTANTS.TITLE}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          <OnboardingPersonalForm
            initialEmail={email}
            initialFullName={fullName}
            initialAvatarUrl={avatarUri}
            onDataChange={handlePersonalDataChange}
          />
        )}

        {currentStep === 2 && (
          <HouseActionSelector
            selectedAction={selectedAction}
            onActionSelect={setSelectedAction}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep === 2 && (
          <Button
            variant="outline"
            action="secondary"
            size="md"
            onPress={handleBack}
            isDisabled={isProcessing}
            style={styles.footerButton}
            isFocusVisible={false}
            accessibilityRole="button"
            accessibilityLabel={ONBOARDING_CONSTANTS.BACK}
          >
            <ButtonText>{ONBOARDING_CONSTANTS.BACK}</ButtonText>
          </Button>
        )}

        {currentStep === 1 ? (
          <Button
            variant="solid"
            action="primary"
            size="md"
            onPress={handleNext}
            isDisabled={!canProceedFromStep1 || isProcessing}
            style={styles.footerButton}
            isFocusVisible={false}
            accessibilityRole="button"
            accessibilityLabel={ONBOARDING_CONSTANTS.NEXT}
          >
            <ButtonText>{ONBOARDING_CONSTANTS.NEXT}</ButtonText>
          </Button>
        ) : (
          <Button
            variant="solid"
            action="primary"
            size="md"
            onPress={handleComplete}
            isDisabled={!canComplete || isProcessing}
            style={styles.footerButton}
            isFocusVisible={false}
            accessibilityRole="button"
            accessibilityLabel={ONBOARDING_CONSTANTS.COMPLETE}
          >
            {isProcessing ? (
              <ButtonSpinner />
            ) : (
              <ButtonText>{ONBOARDING_CONSTANTS.COMPLETE}</ButtonText>
            )}
          </Button>
        )}
      </View>
    </View>
  );
};
