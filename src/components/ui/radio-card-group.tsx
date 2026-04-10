type Option = {
  value: string;
  label: string;
  description: string;
};

export function RadioCardGroup({
  name,
  label,
  defaultValue,
  options
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: Option[];
}) {
  return (
    <fieldset>
      <legend className="mb-3 block text-sm font-medium text-charcoal">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.value} className="group block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              className="peer sr-only"
            />
            <span className="flex min-h-28 flex-col rounded-[24px] border border-charcoal/10 bg-white px-4 py-4 transition peer-checked:border-forest-700 peer-checked:bg-forest-900 peer-checked:text-cream group-hover:border-forest-500/40">
              <span className="text-sm font-semibold tracking-[-0.02em]">{option.label}</span>
              <span className="mt-2 text-sm leading-6 opacity-75">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
