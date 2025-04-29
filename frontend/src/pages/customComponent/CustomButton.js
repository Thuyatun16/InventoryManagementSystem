import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

const StyledButton = styled(Button)(({ theme, backgroundColor }) => ({
  // borderRadius: '8px',
  height: '42px !important',
  textTransform: 'none',
  padding: '0 22px',
  '&.MuiButton-sizeLarge': {
    padding: '0 24px',
  },
  '&.MuiButton-sizeSmall': {
    padding: '0 10px',
  },
  '&.MuiButton-contained': {
    boxShadow: 'none',
    '&.MuiButton-containedPrimary': {
      background: backgroundColor || 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      '&:hover': {
        background: backgroundColor ? theme.palette.darken(backgroundColor, 0.2) : 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)'
      }
    },
    '&.MuiButton-containedDisabled': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
    },
    '&:hover': {
      boxShadow: 'none',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: '#4f46e5',
    color: '#4f46e5',
    '&:hover': {
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.04)',
    },
  },
  '&.Mui-disabled': {
    backgroundColor: `${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'} !important`,
    color: `${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)'} !important`,
  },
}));

const CustomButton = ({
  children,
  backgroundColor,
  loading = false,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      backgroundColor={backgroundColor}
      disabled={loading || props.disabled}
      variant={variant}
      color={color}
      size={size}
      type={type}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
          }}
        />
      ) : (
        children
      )}
    </StyledButton>
  );
};

CustomButton.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};



export default CustomButton;