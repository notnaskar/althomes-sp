interface PillProps {
  label: string
  href: string
  icon: React.ReactNode
}

export default function Pill({ label, href, icon }: PillProps) {
  return (
    <a
      href={href}
      className="relative flex items-center justify-end w-[142px] h-[32px] bg-white rounded-[20px] pl-2 pr-9 text-[9px] tracking-[0.1em] leading-[1.1] text-[#3A3A3A] whitespace-pre-line text-right shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
    >
      {label}
      <span className="absolute right-0 top-0 w-[30px] h-[30px] rounded-full flex items-center justify-center">
        {icon}
      </span>
    </a>
  )
}
