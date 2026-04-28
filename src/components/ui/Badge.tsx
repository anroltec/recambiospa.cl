interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "muted";
}

const variantClasses = {
  primary: "text-primary bg-primary/10",
  success: "text-green-700 bg-green-100",
  muted: "text-gray-500 bg-gray-100",
};

export default function Badge({ label, variant = "primary" }: BadgeProps) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
