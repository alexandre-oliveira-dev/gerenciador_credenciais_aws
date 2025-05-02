import {useState} from "react";

export default function useToast() {
  const [toastProps, setToastProps] = useState<{
    text: string;
    color: string;
  } | null>(null);

  const showToast = (props: {text: string; color: string} | null) => {
    setToastProps(props);
    setTimeout(() => {
      setToastProps(null);
    }, 2000);
  };

  return {toastProps, showToast};
}
