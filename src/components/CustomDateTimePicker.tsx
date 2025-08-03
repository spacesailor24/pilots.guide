"use client";

import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDateTimePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
  required?: boolean;
  autoFocus?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder, onChange }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full min-w-0 px-4 py-3 bg-zinc-800 border border-red-600/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-text block"
    />
  )
);

CustomInput.displayName = "CustomInput";

export default function CustomDateTimePicker({
  selected,
  onChange,
  placeholderText = "Select date and time...",
  minDate,
  required = false,
  autoFocus = false,
}: CustomDateTimePickerProps) {
  const handleChange = (
    date: Date | null,
    event?: React.SyntheticEvent<any>
  ) => {
    onChange(date);
  };

  return (
    <div className="custom-datepicker w-full">
      <DatePicker
        selected={selected}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMM d, yyyy h:mm aa"
        placeholderText={placeholderText}
        minDate={minDate}
        customInput={<CustomInput />}
        popperClassName="custom-datepicker-popper"
        calendarClassName="custom-datepicker-calendar"
        required={required}
        autoFocus={autoFocus}
        shouldCloseOnSelect={false}
        showPopperArrow={false}
        wrapperClassName="w-full"
        allowSameDay={true}
        strictParsing={false}
        enableTabLoop={false}
      />

      <style jsx global>{`
        .custom-datepicker {
          width: 100% !important;
        }

        .custom-datepicker .react-datepicker-wrapper {
          width: 100% !important;
          display: block !important;
        }

        .custom-datepicker .react-datepicker__input-container {
          width: 100% !important;
          display: block !important;
        }

        .custom-datepicker-popper {
          z-index: 9999;
        }

        .custom-datepicker-calendar {
          background-color: #18181b !important;
          border: 1px solid #dc2626 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          font-family: inherit !important;
        }

        .custom-datepicker-calendar .react-datepicker__header {
          background-color: #27272a !important;
          border-bottom: 1px solid #dc2626 !important;
          border-radius: 8px 8px 0 0 !important;
        }

        .custom-datepicker-calendar .react-datepicker__current-month {
          color: #ffffff !important;
          font-weight: 600 !important;
        }

        .custom-datepicker-calendar .react-datepicker__day-name {
          color: #a1a1aa !important;
          font-weight: 500 !important;
        }

        .custom-datepicker-calendar .react-datepicker__day {
          color: #ffffff !important;
          background-color: transparent !important;
          border-radius: 4px !important;
          transition: all 0.2s !important;
        }

        .custom-datepicker-calendar .react-datepicker__day:hover {
          background-color: #dc2626 !important;
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__day--selected {
          background-color: #dc2626 !important;
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__day--today {
          background-color: #6b7280 !important;
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__day--disabled {
          color: #ffffff !important;
          background-color: transparent !important;
        }

        .custom-datepicker-calendar .react-datepicker__navigation {
          border: none !important;
          border-radius: 4px !important;
        }

        .custom-datepicker-calendar .react-datepicker__navigation:hover {
          background-color: #dc2626 !important;
        }

        .custom-datepicker-calendar .react-datepicker__navigation-icon::before {
          border-color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-container {
          border-left: 1px solid #dc2626 !important;
          background-color: #18181b !important;
        }

        .custom-datepicker-calendar
          .react-datepicker__time-container
          .react-datepicker__time {
          background-color: #18181b !important;
        }

        .custom-datepicker-calendar
          .react-datepicker__time-container
          .react-datepicker__time
          .react-datepicker__time-box {
          background-color: #18181b !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-container .react-datepicker__header {
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-container .react-datepicker__header--time {
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-container .react-datepicker__header--time div {
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-name {
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-list-item {
          color: #ffffff !important;
          background-color: transparent !important;
          transition: all 0.2s !important;
        }

        .custom-datepicker-calendar .react-datepicker__time-list-item:hover {
          background-color: #dc2626 !important;
          color: #ffffff !important;
        }

        .custom-datepicker-calendar
          .react-datepicker__time-list-item--selected {
          background-color: #dc2626 !important;
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__header__dropdown {
          background-color: #27272a !important;
        }

        .custom-datepicker-calendar .react-datepicker__month-dropdown,
        .custom-datepicker-calendar .react-datepicker__year-dropdown {
          background-color: #18181b !important;
          border: 1px solid #dc2626 !important;
          border-radius: 4px !important;
        }

        .custom-datepicker-calendar .react-datepicker__month-option,
        .custom-datepicker-calendar .react-datepicker__year-option {
          color: #ffffff !important;
        }

        .custom-datepicker-calendar .react-datepicker__month-option:hover,
        .custom-datepicker-calendar .react-datepicker__year-option:hover {
          background-color: #dc2626 !important;
        }

        .custom-datepicker-calendar
          .react-datepicker__month-option--selected_month,
        .custom-datepicker-calendar
          .react-datepicker__year-option--selected_year {
          background-color: #dc2626 !important;
        }
      `}</style>
    </div>
  );
}
