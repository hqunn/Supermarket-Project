import { useFormContext, Controller } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
  FormControl,
} from "@mui/material";

function FRadioGroup({
  name,
  options,
  getOptionLabel,
  keyExtractor,
  ...other
}) {
  const { control } = useFormContext();

  if (!options || options.length === 0) {
    return <FormHelperText error>Options are required</FormHelperText>;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Đảm bảo giá trị value an toàn
        const validValue = field.value || "";

        return (
          <FormControl error={!!error}>
            <RadioGroup
              {...field}
              value={validValue}
              onChange={(e) => field.onChange(e.target.value)}
              row
              {...other}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={keyExtractor ? keyExtractor(option) : option.value}
                  value={
                    keyExtractor
                      ? String(keyExtractor(option) ?? "")
                      : String(option.value ?? "")
                  }
                  control={<Radio />}
                  label={getOptionLabel ? getOptionLabel(option) : option.label}
                />
              ))}
            </RadioGroup>

            {!!error && (
              <FormHelperText sx={{ px: 2 }}>{error.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}

export default FRadioGroup;
