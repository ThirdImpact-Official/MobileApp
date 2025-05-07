import { GetDifficultyLevelDto } from "@/interfaces/EscapeGameInterface/DifficultyLevel/getDifficultyLevelDto";
import { GetPriceDto } from "@/interfaces/EscapeGameInterface/Price/getPriceDto";


 class FormUtils<T extends Record<string, unknown>> {
  /**
   * Handles form submission by preventing default event behavior and calling the provided onSubmit function.
   *
   * @param {React.FormEvent} event - Form event object.
   * @param {Function} onSubmit - Function to call when the form is submitted.
   */
  public async handleSubmit(
    e: React.FormEvent,
    onSubmit?: () => Promise<void>
  ): Promise<void> {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit();
    }
  }

  /**
   * Handles change events for form fields by updating the corresponding state property.
   *
   * @param {keyof T} key - Property key to update in state.
   * @param {string} value - New value for the property.
   */
  static handleOnChange<T extends Record<string, any>>(
    key: keyof T,
    value: any,
    setData: React.Dispatch<React.SetStateAction<T | undefined>>,
    originalData?: T
  ): void {
    setData((prevData) => {
      // If prevData is undefined, create a new object
      const currentData = prevData || {} as T;
      
      // Determine the expected type based on original data if provided
      if (originalData) {
        const originalValue = originalData[key];
        // Convert value to the appropriate type
        let typedValue = value;
  
        if (typeof originalValue === 'number') {
          typedValue = value === '' ? null : Number(value);
        } else if (typeof originalValue === 'boolean') {
          typedValue = value === 'true' || value === true;
        }
  
        return {
          ...currentData,
          [key]: typedValue,
        };
      }
  
      // Default behavior if no original data provided
      return {
        ...currentData,
        [key]: value,
      };
    });
  }
  static handleInputChange<T extends Record<string, any>>(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, 
    setData: React.Dispatch<React.SetStateAction<T | undefined>>,
    originalData?: T
  ): void {
    const { name, value, type } = event.target;
    const key = name as keyof T;
    
    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked;
      this.handleOnChange<T>(key, checked, setData, originalData);
      return;
    }
    
    this.handleOnChange<T>(key, value, setData, originalData);
  }
  
  /**
   * Formats a date as a string in the format "MM/dd/yyyy".
   *
   * @param {Date} dateToFormat - Date to format.
   * @returns {string} Formatted date string.
   */
  public formatString(dateToFormat: Date): string {
    if (!dateToFormat) {
      throw new Error("Date not found");
    }

    return dateToFormat.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  public formatDateString(value: string)
  {
      if (!isNaN(Date.parse(value))) {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }); // Format MM/DD/YYYY
    }
    return value;
  }

  public static isGetDifficultyLevelDto(
    value: unknown
  ): value is GetDifficultyLevelDto {
    return (
      value !== null &&
      typeof value === "object" &&
      "dowId" in value &&
      typeof value.dowId === "number" &&
      "dowName" in value &&
      typeof value.dowName === "string"
    );
  }

  public static isGetPriceDto(value: unknown): value is GetPriceDto {
    return (
      value !== null &&
      typeof value === "object" &&
      "id" in value &&
      typeof value.id === "number" &&
      "indicePrice" in value &&
      typeof value.indicePrice === "number"
    );
  }

  public static TableMapper<T>(labelName: string, accessorName: keyof T)
  {
    return {label: labelName, accessor: accessorName };
  }
  public static FormatDate(dateString: string | null | undefined):string
  {
    if (!dateString) return 'Date inconnue';

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Date inconnue' : new Intl.DateTimeFormat('fr-FR').format(date);
  }
}


export default FormUtils;