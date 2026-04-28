export interface DropdownItem {
  name: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  dropdown?: "catalog" | "light" | "heavy";
}
