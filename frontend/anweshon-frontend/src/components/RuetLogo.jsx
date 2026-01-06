import ruetLogo from "../assets/ruet_logo.png";

export default function RuetLogo({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <img
      src={ruetLogo}
      alt="RUET logo"
      className={`${sizes[size]} ${className} rounded-full object-contain shadow-lg`}
    />
  );
}
