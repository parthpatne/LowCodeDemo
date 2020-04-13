import { IconProps } from "@stardust-ui/react";

export interface AdaptiveMenuItem {
    key: string;
    content: React.ReactNode;
    icon?: IconProps;
    onClick: (event?) => void;
    className?: string;
}