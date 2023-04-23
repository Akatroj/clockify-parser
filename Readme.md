Example usage:


windows:
```cmd
tsx . -i ./data/Clockify_Time_Report_Detailed_01_07_2022-23_04_2023.xlsx  --part-time-ranges ./data/partTime.json --paid-leave ./data/paidLeave.json
```


input files specification:

`-i`: path to clockify detailed report (xlsx) for single user. You can generate one here: https://app.clockify.me/reports/detailed

`--part-time-ranges`: path to JSON file with part time information. Matches the `examples/partTime.example.json` structure

`--paid-leave`: path to JSON file with paid leave information. Matches the `examples/paidLeave.example.json` structure
