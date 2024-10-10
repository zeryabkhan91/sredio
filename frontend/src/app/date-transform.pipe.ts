import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransform'
})
export class DateTransform implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    
    // Extract the components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    
    // Return formatted date string
    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
  }
}
