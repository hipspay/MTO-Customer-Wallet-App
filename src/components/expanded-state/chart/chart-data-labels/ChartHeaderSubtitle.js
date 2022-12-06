import { TruncatedText } from '../../../text';
import styled from '@rainbow-me/styled-components';

const ChartHeaderSubtitle = styled(TruncatedText).attrs(
  ({
    theme: { colors },
    color = colors.black,
    letterSpacing = 'roundedMedium',
    testID,
    weight = 'bold',
  }) => ({
    color,
    letterSpacing,
    size: 'large',
    testID,
    weight,
  })
)({
  flex: 1,
  ...(android ? { marginLeft: 9, marginVertical: -10 } : {}),
});

export default ChartHeaderSubtitle;
