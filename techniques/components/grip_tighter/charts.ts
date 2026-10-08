// Chart data, with sources. Every number on screen comes from here; script/SCRIPT.md → Charts lists the sources.

/** Enslaved people counted by each census (U.S. Census Bureau, Working Paper 56, Table 1). */
export const ENSLAVED = [
  {year: 1790, n: 697681},
  {year: 1800, n: 893602},
  {year: 1810, n: 1191362},
  {year: 1820, n: 1538022},
  {year: 1830, n: 2009043},
  {year: 1840, n: 2487355},
  {year: 1850, n: 3204313},
  {year: 1860, n: 3953760},
];

/** Cotton grown, thousands of 500-lb bales (HSUS Bicentennial, series K 554; matches NBER/FRED A01028USA558NNBR). */
export const COTTON_BALES_K = [
  {year: 1790, n: 3},
  {year: 1800, n: 73},
  {year: 1810, n: 178},
  {year: 1820, n: 335},
  {year: 1830, n: 732},
  {year: 1840, n: 1348},
  {year: 1850, n: 2136},
  {year: 1860, n: 3841},
];

/** Pie 1: everyone living in the 15 slave states, 1860 (Census WP56 state tables; matches 1860 Population vol. p. vii). DC excluded; 2,296 enumerated American Indians omitted. */
export const SLAVE_STATES_1860 = {enslaved: 3950511, freeBlack: 250787, white: 8036699};

/** Pie 2: free families in the 15 slave states, 1860 (1,515,605; Statistics vol. p. 351), by slaveholding (Agriculture vol. p. 247,
 *  Arkansas row corrected from p. 224: 11,481 holders, not the misprinted 1,149). 393,967 holders: 346,396 held 1–19, 47,571 held 20+. */
export const WHITE_FAMILIES_1860 = {none: 1121638, small: 346396, planters: 47571};

/** Cotton as a share of U.S. merchandise exports by value, FY1860: $192M of $316M = 61% (HSUS U 276 / U 191). */
export const EXPORTS_1860 = {cotton: 192e6, other: 316e6 - 192e6};

/** Value of enslaved people (HSUS Millennial Bb213, $3,059M; Blight estimates $3.5B) vs. railroad construction cost ($1,134M, 1860 Statistics vol. p. 323)
 *  and manufacturing capital ($1,010M, 1860 Manufactures vol. p. 729). */
export const VALUE_1860 = {enslaved: 3.059e9, railroads: 1.134e9, manufacturing: 1.010e9};

/** People moved from the Upper South to the Lower South, by decade (Tadman, Speculators and Slaves, p. 12): ~1.1 million in all. */
export const TRADE_BY_DECADE = [
  {decade: '1790s', n: 49511},
  {decade: '1800s', n: 65791},
  {decade: '1810s', n: 123386},
  {decade: '1820s', n: 154712},
  {decade: '1830s', n: 284750},
  {decade: '1840s', n: 183902},
  {decade: '1850s', n: 250728},
];
