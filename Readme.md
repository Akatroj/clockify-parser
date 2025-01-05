# Clockify Report Parser
This script parses time tracking reports generated from the Clockify app and calculates various metrics including total work time per month. It allows for customization to account for part-time schedules, paid leaves, and report formats.

## Features
* Parses Clockify reports in CSV and XLSX formats.
* Fetches reports using Clockify API.
* Calculates total work time per month.
* Compares work time with expected work time (workhours.json, taken from https://www.kalendarzswiat.pl/wymiar_czasu_pracy/2025).
* Accounts for part-time schedules defined in a JSON file (partTime.json).
* Recognizes paid leave periods specified in a JSON file (paidLeave.json).

There are example json files provided in `/examples/` dir, so you can figure out the structure.

Usage:
```
pnpm install
pnpm start -i <path-to-report-file>
```

By default, the script will look for json files in `./data/partTime.json` and `./data/paidLeave.json`. You can pass a custom path to these files like this: `--part-time-ranges <path-to-part-time-json-file> --paid-leave <path-to-paid-leave-json-file>`. If these files are not found, the script will assume all full-time and no paid leave.


Example usage:

* Fetch report through api

```cmd
pnpm start api --start 2024-01-01 --end 2024-12-31
```

or, with custom paid leave file location:

```cmd
pnpm start api --start 2024-01-01 --end 2024-12-31 --part-time-ranges ./data/partTime.json --paid-leave ./data/paidLeave.json
```

* Calculate using local report file:

```cmd
pnpm start -i ./data/Clockify_Time_Report_Detailed_01_07_2022-23_04_2023.xlsx
```

or, with custom paid leave file location:

```cmd
pnpm start -i ./data/Clockify_Time_Report_Detailed_01_07_2022-23_04_2023.xlsx  --part-time-ranges ./data/partTime.json --paid-leave ./data/paidLeave.json
```


input files specification:

`-i`: path to clockify detailed report (xlsx or CSV) for single user. You can generate one here: https://app.clockify.me/reports/detailed. You have to switch the filter to only include 1 user.

`--part-time-ranges`: path to JSON file with part time information. Matches the `examples/partTime.example.json` structure

`--paid-leave`: path to JSON file with paid leave information. Matches the `examples/paidLeave.example.json` structure
