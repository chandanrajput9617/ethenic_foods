import React, { useEffect, useRef } from 'react';

const PlaceAutoComplete = () => {
  let autocomplete;
  let address1Field = useRef(null);
  let address2Field = useRef(null);
  let postalField = useRef(null);

  useEffect(() => {
    initAutocomplete();
  }, []);

  const initAutocomplete = () => {
    // Use refs to access the DOM elements
    address1Field = address1Field.current;
    address2Field = address2Field.current;
    postalField = postalField.current;

    // Create the autocomplete object, restricting the search predictions to
    // addresses in the US and Canada.]s
    autocomplete = new window.google.maps.places.Autocomplete(address1Field, {
      componentRestrictions: { country: ["us", "ca"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });
    address1Field.focus();

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", fillInAddress);
  };

  const fillInAddress = () => {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
    let address1 = "";
    let postcode = "";

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case "route": {
          address1 += component.short_name;
          break;
        }

        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case "postal_code_suffix": {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }

        case "locality":
          // Set value for the locality input field
          address2Field.value = component.long_name;
          break;

        case "administrative_area_level_1": {
          // Set value for the state input field
          postalField.value = component.short_name;
          break;
        }

        case "country":
          // Set value for the country input field
          // You might want to use state or context to handle form state
          break;
      }
    }

    address1Field.value = address1;
    postalField.value = postcode;

    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line
    address2Field.focus();
  };

  return (
    <div>
      <input id="ship-address" ref={address1Field} />
      <input id="address2" ref={address2Field} />
      <input id="postcode" ref={postalField} />
    </div>
  );
};

export default PlaceAutoComplete;
