"use client";

import { differenceInYears, differenceInMonths, addYears } from "date-fns";
import { FC } from "react";

/**
 * COLORS:
 *
 * amber
 * lime
 * teal
 * sky
 * violet
 * rose
 */

type LifeStageItem = {
  name: string;
  color: string;
  from: () => number;
  to: () => number;
  kids?: {
    name: string;
    from?: () => number;
    to?: () => number;
  }[];
};
type LifeStage = {
  [key: string]: LifeStageItem;
};

export default function Home() {
  // User info
  const userDateOfBirth = new Date("1991-03-21");
  const userCurrentAge = differenceInYears(new Date(), userDateOfBirth);
  const userGoToSchoolYear = 7;
  const userEndOfSchool = new Date("2008-06-01");
  const userEndOfStudies = new Date("2015-03-01");
  const userKids = [
    {
      name: "Emily",
      dateOfBirth: new Date("2020-07-01"),
    },
    {
      name: "Melania",
      dateOfBirth: new Date("2022-05-20"),
    },
  ];

  const settings = {
    monthsInYear: 12,
    targetYO: 70,
    yearColumns: 3,

    getRows: () => Math.round(settings.targetYO / settings.yearColumns),
    getColumns: () => settings.yearColumns * settings.monthsInYear,
  };

  const lifeStages: LifeStage = {
    childhood: {
      name: "Childhood",
      color: "bg-teal-300",
      from: () => 1,
      to: () =>
        differenceInMonths(
          addYears(new Date(userDateOfBirth), userGoToSchoolYear),
          userDateOfBirth
        ),
    },
    school: {
      name: "School",
      color: "bg-sky-300",
      from: () => lifeStages.childhood.to() + 1,
      to: () => differenceInMonths(userEndOfSchool, userDateOfBirth),
    },
    studies: {
      name: "Studies",
      color: "bg-amber-300",
      from: () => lifeStages.school.to() + 1,
      to: () =>
        lifeStages.school.to() +
        differenceInMonths(userEndOfStudies, userEndOfSchool),
    },
    work: {
      name: "Work",
      color: "bg-rose-300",
      from: () => lifeStages.studies.to() + 1,
      to: () =>
        lifeStages.studies.to() +
        differenceInMonths(new Date(), userEndOfStudies),
    },
    kids: {
      name: "Time with kids",
      color: "bg-lime-300",
      from: () => 0,
      to: () => 0,
      kids: [
        {
          name: "Emily",
          from: () =>
            differenceInMonths(userKids[0].dateOfBirth, userDateOfBirth),
          to: () =>
            differenceInMonths(userKids[0].dateOfBirth, userDateOfBirth) +
            differenceInMonths(
              addYears(userKids[0].dateOfBirth, 18),
              userKids[0].dateOfBirth
            ),
        },
        {
          name: "Melania",
          from: () =>
            differenceInMonths(userKids[1].dateOfBirth, userDateOfBirth),
          to: () =>
            differenceInMonths(userKids[1].dateOfBirth, userDateOfBirth) +
            differenceInMonths(
              addYears(userKids[1].dateOfBirth, 18),
              userKids[1].dateOfBirth
            ),
        },
      ],
    },
  };

  const totalRows = settings.getRows();
  const totalColumnsInRow = settings.getColumns();

  const getLifeStageByMonthNumber = (monthNumber: number) => {
    let targetLifeStage = Object.entries(lifeStages).find(
      ([_key, value]) =>
        value.from() <= monthNumber && monthNumber <= value.to()
    );

    if (!targetLifeStage) return;

    const lifeStage: LifeStageItem = targetLifeStage[1];
    return lifeStage;
  };

  const Grid: FC = () => {
    let currentMonthNumber = 0;
    let currentColor: string | null = null;

    return (
      <div className="flex flex-col relative mx-[200px]">
        <div className="text-xs text-indigo-400 text-center mb-1">
          1 row = 36 months = 3 year
        </div>
        <div className="rounded-xl border-t border-indigo-400 h-10 -mb-6"></div>
        {[...Array(totalRows)].map((x, i) => {
          const nextLifeStage = getLifeStageByMonthNumber(
            currentMonthNumber + 1
          );
          let rowInfo = null;
          if (nextLifeStage?.color && nextLifeStage.color !== currentColor) {
            currentColor = nextLifeStage.color;
            rowInfo = (
              <div className="row-info absolute w-[200px] ml-[-200px] left-0 flex justify-end items-center">
                <div
                  className={`text-xs font-semibold ${currentColor} text-indigo-900 py-1 px-2 rounded-lg bg-opacity-50`}
                >
                  {nextLifeStage.name}
                  <span className="ml-1 font-normal">
                    ({nextLifeStage.to() - nextLifeStage.from()})
                  </span>
                </div>
                <div className="w-8 ml-1 text-indigo-600 mt-[-2px]">→</div>
              </div>
            );
          }

          return (
            <div key={i} className="flex flex-row p-1 gap-1">
              {rowInfo}
              {[...Array(totalColumnsInRow)].map((x2, i2) => {
                currentMonthNumber++;
                return (
                  <div
                    key={`month-${currentMonthNumber}`}
                    className={`
                      p-1 border border-indigo-400 w-6 h-6 rounded-[40%] 
                      month-${currentMonthNumber}
                      ${i2 === 11 && "mr-3"}
                      ${i2 === 23 && "mr-3"}
                      ${getLifeStageByMonthNumber(currentMonthNumber)?.color}
                    `}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const Header: FC = () => (
    <header className="mb-10 text-center">
      <h1 className="text-3xl font-semibold text-indigo-800">
        A life remaining time in months
      </h1>
      <div className="text-sm font-medium text-sky-700">
        (Average life expectancy of 70 years)
      </div>
    </header>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24 pt-10 w-fit">
      <Header />
      <Grid />
    </main>
  );
}
