/**
 * Encodes string
 */
export function e(value) {
    if (value) {
        if (typeof value !== 'string') {
            value = '' + value;
        }
        return value
            .replace(/\n/g, '\n')
            .replace(/,/g, ',')
            .replace(/;/g, ';');
    }
    return '';
}
/**
 * Return new line characters
 */
export function nl() {
    return '\n';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC12Y2FyZC9zcmMvbGliL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLFVBQVUsQ0FBQyxDQUFDLEtBQXlCO0lBQ3pDLElBQUksS0FBSyxFQUFFO1FBQ1QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsS0FBSyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7U0FDcEI7UUFDRCxPQUFPLEtBQUs7YUFDVCxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQzthQUNwQixPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzthQUNsQixPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsRUFBRTtJQUNoQixPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEVuY29kZXMgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlKHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSAnJyArIHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcbicpXG4gICAgICAucmVwbGFjZSgvLC9nLCAnLCcpXG4gICAgICAucmVwbGFjZSgvOy9nLCAnOycpO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gbmV3IGxpbmUgY2hhcmFjdGVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbmwoKTogc3RyaW5nIHtcbiAgcmV0dXJuICdcXG4nO1xufVxuIl19