import React from 'react';

interface AutocompleteAddressInputProps {
  streetValue: string;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
}

const AutocompleteAddressInput: React.FC<AutocompleteAddressInputProps> = ({
  streetValue,
  onStreetChange,
  onCityChange,
  onStateChange,
  onCountryChange,
  onPostalCodeChange,
}) => {
  return (
    <div className="autocomplete-address-input">
      <input
        type="text"
        value={streetValue}
        onChange={(e) => onStreetChange(e.target.value)}
        placeholder="Enter Street Address"
      />
      <input
        type="text"
        onChange={(e) => onCityChange(e.target.value)}
        placeholder="Enter City"
      />
      <input
        type="text"
        onChange={(e) => onStateChange(e.target.value)}
        placeholder="Enter State"
      />
      <input
        type="text"
        onChange={(e) => onCountryChange(e.target.value)}
        placeholder="Enter Country"
      />
      <input
        type="text"
        onChange={(e) => onPostalCodeChange(e.target.value)}
        placeholder="Enter Postal Code"
      />
    </div>
  );
};

export default AutocompleteAddressInput;
