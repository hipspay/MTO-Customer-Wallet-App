import { View } from 'react-native';
import ActivityIndicator from '../../components/ActivityIndicator';
import Spinner from '../../components/Spinner';
import styled from '@rainbow-me/styled-components';
export const LoadingWrapper = styled(View)({
  alignItems: 'center',
  backgroundColor: '#000',
  height: '100%',
  justifyContent: 'center',
  opacity: 0.6,
  paddingBottom: 10,
  paddingRight: 10,
  position: 'absolute',
  width: '100%',
});

export const LoadingSpinner = styled(
  android ? Spinner : ActivityIndicator
).attrs(({ theme: { colors } }) => ({
  color: colors.alpha(colors.white, 0.3),
  size: 50,
}))({
  marginBottom: android ? -10 : 19,
  marginTop: 12,
});
