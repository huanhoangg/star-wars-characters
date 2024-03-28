import React, { ReactNode } from "react";
import { Button } from "antd";
import { StarFilled } from "@ant-design/icons";

interface CustomButtonProps {
  onClick: () => void;
  isInFavoriteMode: boolean;
  label: string;
  icon?: ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  isInFavoriteMode,
  label,
  icon,
}) => {
  return (
    <Button
      onClick={onClick}
      style={{
        width: "180px",
        backgroundColor: isInFavoriteMode ? "#FFE81F" : "black",
        color: isInFavoriteMode ? "black" : "#FFE81F",
        transition: "all 0.5s",
        border: "0",
      }}
      icon={icon}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
