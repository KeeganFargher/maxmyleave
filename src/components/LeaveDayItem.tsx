import {
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	UnorderedList,
	ListItem,
	Text,
	Box,
} from '@chakra-ui/react';
import {
	Calendar,
	CalendarControls,
	CalendarPrevButton,
	CalendarNextButton,
	CalendarMonths,
	CalendarMonth,
	CalendarMonthName,
	CalendarWeek,
	CalendarDays,
} from '@uselessdev/datepicker';
import { DayType, LeaveDay } from '../services/holiday/holidayService';
import dayjs from 'dayjs';
import React from 'react';
var advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

const LeaveDayItem: React.FC<{ leave: LeaveDay }> = ({ leave }) => {
	const dateFrom = dayjs(leave.dateFrom).format('DD MMM YYYY');
	const dateTo = dayjs(leave.dateTo).format('DD MMM YYYY');

	const publicHolidays = leave.timeline.filter(
		(x) => x.dayType === DayType.PublicHoliday
	);

	function humanizeDuration(quantity: number, word: string): string {
		return quantity <= 1 ? `1 ${word}` : `${quantity} ${word}s`;
	}

	return (
		<AccordionItem fontFamily='Lexend'>
			{({ isExpanded }) => (
				<React.Fragment>
					<h2>
						<AccordionButton>
							<Box
								as='span'
								pt={3}
								pb={3}
								flex='1'
								display='flex'
								justifyContent='space-around'
								alignItems='center'
								textAlign='left'
								style={{ fontFeatureSettings: 'tnum' }}>
								<Box
									as='span'
									flex={1}
									// fontWeight={isExpanded ? "bold" : "regular"}
									// color={isExpanded ? "green.500" : "black"}
								>
									{dateFrom} →{' '}
									<Box
										display={{
											base: 'block',
											md: 'inline-block',
										}}>
										{dateTo}
									</Box>
								</Box>
								<Box
									as='span'
									flex={1}
									textAlign='center'
									fontWeight='bold'>
									{humanizeDuration(leave.daysOfLeave, 'Day')}
								</Box>
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					{isExpanded && (
						<AccordionPanel
							pb={4}
							display='flex'
							flexDirection={{ base: 'column-reverse', md: 'row' }}>
							<Box flex={1}>
								<Box mb={6}>
									<Text mb={1.5} fontWeight='500'>
										{humanizeDuration(
											leave.daysOfPublicHolidays,
											'Public Holiday'
										)}{' '}
										{leave.daysOfPublicHolidays >= 3 && '🔥'}
									</Text>
									{publicHolidays?.length === 0 && ':('}
									<UnorderedList fontSize='sm'>
										{publicHolidays.map((y) => (
											<ListItem
												key={y.publicHolidayName}
												mb={1.5}>
												<Text
													fontStyle='italic'
													fontSize='xs'
													color='gray.600'>
													{y.date.format('Do MMM')}
												</Text>
												<Text lineHeight='shorter'>
													{y.publicHolidayName}
												</Text>
											</ListItem>
										))}
									</UnorderedList>
								</Box>

								<Box>
									<Text mb={1.5} fontWeight='500'>
										{humanizeDuration(
											leave.daysOfWeekend,
											'Weekend'
										)}
									</Text>

									{leave.daysOfWeekend === 0 && ':('}
									{leave.daysOfWeekend > 1 && (
										<Text fontSize='sm'>
											{leave.daysOfWeekend} Saturdays and{' '}
											{leave.daysOfWeekend} Sundays
										</Text>
									)}
								</Box>
							</Box>

							<Box
								display='flex'
								justifyContent='center'
								mb={{ base: 3, md: 0 }}>
								<Calendar
									value={{
										start: leave.dateFrom.toDate(),
										end: leave.dateTo.toDate(),
									}}
									onSelectDate={() => {}}>
									<CalendarControls>
										<CalendarPrevButton />
										<CalendarNextButton />
									</CalendarControls>

									<CalendarMonths>
										<CalendarMonth>
											<CalendarMonthName />
											<CalendarWeek />
											<CalendarDays />
										</CalendarMonth>
									</CalendarMonths>
								</Calendar>
							</Box>
						</AccordionPanel>
					)}
				</React.Fragment>
			)}
		</AccordionItem>
	);
};

export default LeaveDayItem;
