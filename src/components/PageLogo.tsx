import React, { useState } from "react";

const PageLogo: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="logo"
      style={{
        ...styles.container,
        ...(isHovered && styles.containerHovered),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={styles.logo}>
        <span
          style={{
            ...styles.text,
            ...(isHovered && styles.textHovered), // Apply hover styles if hovered
          }}
        >
          Star Wars Characters
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.5s",
    backgroundColor: "#000000",
  },
  containerHovered: {
    backgroundColor: "#FFE81F",
    borderBottom: "0",
    width: "100%",
    left: 0,
    right: 0,
  },
  logo: {
    padding: "15px 10px",
    margin: "10px 0",
  },
  text: {
    fontSize: "30px",
    transition: "color 0.5s",
    color: "#FFE81F",
  },
  textHovered: {
    color: "#000000", // Change color when hovered
  },
};

export default PageLogo;
