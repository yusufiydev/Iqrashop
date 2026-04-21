const BrandLogo = ({
    className = '',
    textClassName = '',
    textSizeClass = 'text-[36px]',
}) => {
    return (
        <span className={`inline-flex items-center ${className}`} aria-label="Iqrashop">
            <span className={`font-extrabold leading-none tracking-[-0.03em] ${textSizeClass} ${textClassName || 'text-[#10B981]'}`}>
                Iqrashop
            </span>
        </span>
    );
};

export default BrandLogo;
