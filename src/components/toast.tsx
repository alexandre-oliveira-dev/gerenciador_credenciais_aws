// Toast.tsx
import {Tag} from "antd";
import "../App.css";

export default function Toast({text, color}: {text?: string; color?: string}) {
  return (
    text && (
      <Tag
        id="toast"
        style={{
          alignItems: "center",
          fontSize: 20,
          justifyContent: "center",
          padding: "1rem",
          display: "flex",
        }}
        color={color}
      >
        {text}
      </Tag>
    )
  );
}
