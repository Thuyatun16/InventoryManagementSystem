import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";

const NotifierContext = createContext(null);

export const NotifierProvider = ({ children }) => {
  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "Please Confirm",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });
  const confirmResolverRef = useRef(null);

  const showToast = useCallback((message, severity = "info") => {
    setToastState({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeToast = useCallback((_, reason) => {
    if (reason === "clickaway") return;
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  const confirm = useCallback((options) => {
    const {
      title = "Please Confirm",
      message,
      confirmText = "Confirm",
      cancelText = "Cancel",
    } = options;

    setConfirmState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
    });

    return new Promise((resolve) => {
      confirmResolverRef.current = resolve;
    });
  }, []);

  const handleConfirmClose = useCallback((result) => {
    setConfirmState((prev) => ({ ...prev, open: false }));
    if (confirmResolverRef.current) {
      confirmResolverRef.current(result);
      confirmResolverRef.current = null;
    }
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      success: (message) => showToast(message, "success"),
      error: (message) => showToast(message, "error"),
      info: (message) => showToast(message, "info"),
      warning: (message) => showToast(message, "warning"),
      confirm,
    }),
    [confirm, showToast],
  );

  return (
    <NotifierContext.Provider value={value}>
      {children}
      <Snackbar
        open={toastState.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toastState.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastState.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmState.open}
        onClose={() => handleConfirmClose(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{confirmState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmState.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)}>
            {confirmState.cancelText}
          </Button>
          <Button
            onClick={() => handleConfirmClose(true)}
            variant="contained"
            color="error"
          >
            {confirmState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </NotifierContext.Provider>
  );
};

export const useNotifier = () => {
  const context = useContext(NotifierContext);

  if (!context) {
    throw new Error("useNotifier must be used within a NotifierProvider");
  }

  return context;
};
