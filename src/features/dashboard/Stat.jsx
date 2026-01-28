import { Card } from "@heroui/react"
import { HiArrowUpLeft } from 'react-icons/hi2'
import { formateCurrency } from '../../utils/helpers'

function Stat({ title = "", value = 0, subtitle = "", variant = "default", isNumber = false }) {
    return (
        <Card
            shadow="none"
            className={`relative px-6 py-4 overflow-hidden rounded-3xl ${variant === "dark"
                ? "bg-linear-to-br from-gray-950 to-gray-800 text-white"
                : "bg-white"
                }`}
        >
            {/* Arrow Icon */}
            <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center 
                justify-center ${variant === "dark" ? "bg-white/10" : "bg-gray-100"
                }`}>
                <HiArrowUpLeft className={`w-4 h-4 ${variant === "dark" ? "text-white" : "text-gray-600"}`} />
            </div>

            {/* Content */}
            <div className="space-y-2 mt-2">
                {/* Title */}
                <p className={`text-sm font-medium ${variant === "dark" ? "text-white/70" : "text-gray-500"}`}>
                    {title}
                </p>

                {/* Value */}
                <p className={`text-2xl font-bold tracking-tight ${variant === "dark" ? "text-white" : "text-gray-900"}`}>
                    {isNumber ? value : formateCurrency(value)}
                </p>

                {/* Subtitle */}
                <p className={`text-xs font-light ${variant === "dark" ? "text-white/50" : "text-gray-400"}`}>
                    {subtitle}
                </p>
            </div>
        </Card>
    )
}

export default Stat
