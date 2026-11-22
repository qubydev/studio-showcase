"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import useMeasure from "react-use-measure";
import { CalendarDays, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { addDays, addMonths, datePresets, formatDate, formatRange, localDate, monthStart, parseDate, selectRange, type DateRange } from "@/lib/date-range";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const sizeTransition = { type: "spring" as const, stiffness: 430, damping: 38, mass: 0.8 };
const slideTransition = { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const };
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

function ViewContent({ children }: { children: ReactNode }) {
  const present = useIsPresent();
  return <div inert={!present} aria-hidden={!present}>{children}</div>;
}

function AutoSizePanel({ children, className, reducedMotion }: { children: ReactNode; className: string; reducedMotion: boolean | null }) {
  // Measure layout dimensions so the popover's opening scale cannot shrink the panel.
  const [measure, bounds] = useMeasure({ offsetSize: true });
  return <motion.div
    initial={false}
    animate={{ width: bounds.width || "auto", height: bounds.height || "auto" }}
    transition={reducedMotion ? { duration: 0 } : sizeTransition}
    className="overflow-hidden"
  >
    <div ref={measure} className={className}>{children}</div>
  </motion.div>;
}

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DateRangePicker({ value, onChange, mobileAnchor }: { value: DateRange; onChange: (range: DateRange) => void; mobileAnchor?: RefObject<HTMLElement | null> }) {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [month, setMonth] = useState(monthStart(value.from));
  const [focused, setFocused] = useState(value.from);
  const [custom, setCustom] = useState(false);
  const [today, setToday] = useState(value.from);
  const dayButtons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef(false);
  const pendingPresetFocus = useRef(false);
  const customButton = useRef<HTMLButtonElement>(null);
  const monthId = useId();
  const hintId = useId();
  const calendarId = useId();
  const presets = datePresets(today);
  const customSelected = custom || !presets.some(preset => draft.from === preset.range.from && draft.to === preset.range.to);
  const preview = anchor && hovered ? selectRange(anchor, hovered) : draft;
  const offset = (parseDate(month).getUTCDay() + 6) % 7;
  const daysInMonth = parseDate(addDays(addMonths(month, 1), -1)).getUTCDate();
  const weekCount = Math.ceil((offset + daysInMonth) / 7);
  const days = Array.from({ length: weekCount * 7 }, (_, index) => addDays(month, index - offset));
  const monthLabel = parseDate(month).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  useEffect(() => {
    if (!custom && pendingPresetFocus.current) {
      customButton.current?.focus({ preventScroll: true });
      pendingPresetFocus.current = false;
    }
    if (custom && pendingFocus.current) {
      dayButtons.current.get(focused)?.focus({ preventScroll: true });
      pendingFocus.current = false;
    }
  }, [focused, month, custom]);

  function changeOpen(next: boolean) {
    if (next) {
      pendingFocus.current = false;
      pendingPresetFocus.current = false;
      setToday(localDate());
      setCustom(false);
      setDraft(value);
      setAnchor(null);
      setHovered(null);
      setMonth(monthStart(value.from));
      setFocused(value.from);
    }
    setOpen(next);
  }

  function selectDay(day: string) {
    pendingFocus.current = true;
    setDraft(anchor ? selectRange(anchor, day) : { from: day });
    setAnchor(anchor ? null : day);
    setHovered(null);
    setFocused(day);
    setMonth(monthStart(day));
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, day: string) {
    let next: string;
    switch (event.key) {
      case "ArrowLeft": next = addDays(day, -1); break;
      case "ArrowRight": next = addDays(day, 1); break;
      case "ArrowUp": next = addDays(day, -7); break;
      case "ArrowDown": next = addDays(day, 7); break;
      case "Home": next = addDays(day, -((parseDate(day).getUTCDay() + 6) % 7)); break;
      case "End": next = addDays(day, 6 - ((parseDate(day).getUTCDay() + 6) % 7)); break;
      case "PageUp": next = addMonths(day, event.shiftKey ? -12 : -1); break;
      case "PageDown": next = addMonths(day, event.shiftKey ? 12 : 1); break;
      default: return;
    }
    event.preventDefault();
    pendingFocus.current = true;
    setFocused(next);
    setMonth(monthStart(next));
    if (anchor) setHovered(next);
  }

  function browseMonth(amount: number) {
    const next = addMonths(month, amount);
    setMonth(next);
    setFocused(next);
    setHovered(null);
  }

  function choosePreset(range: DateRange) {
    setDraft(range);
    setAnchor(null);
    setHovered(null);
    setMonth(monthStart(range.from));
    setFocused(range.from);
    setCustom(false);
  }

  return <Popover open={open} onOpenChange={changeOpen}>
    <PopoverTrigger render={<Button variant="secondary" size={isMobile ? "icon-lg" : "lg"} aria-label={`Select date or date range: ${formatRange(value)}`} className="gap-4 rounded-full sm:ml-2 sm:px-4" />}>
      <span className="hidden text-xs sm:inline">{formatRange(value)}</span>
      <CalendarDays />
    </PopoverTrigger>
    <PopoverContent anchor={isMobile ? mobileAnchor : undefined} align="end" className="origin-top-right overflow-x-hidden p-0 transition-[opacity,transform] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none">
      <PopoverTitle className="sr-only">Select dates</PopoverTitle>
      <PopoverDescription id={hintId} className="sr-only">Choose a preset, or use Custom to select one date or a range. Done applies your selection.</PopoverDescription>
      <AutoSizePanel reducedMotion={reducedMotion} className={cn("relative p-2", custom ? "w-64" : "w-56")}>
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={custom ? "calendar" : "presets"}
              custom={direction}
              variants={slideVariants}
              initial={reducedMotion ? false : "enter"}
              animate="center"
              exit="exit"
              transition={reducedMotion ? { duration: 0 } : slideTransition}
            >
              <ViewContent>
                {custom ? <div id={calendarId} className="p-1">
                  <div className="mb-1 flex items-center justify-between">
        <Button variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => browseMonth(-1)}><ChevronLeft /></Button>
        <h2 id={monthId} aria-live="polite" className="text-sm font-medium">{monthLabel}</h2>
        <Button variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => browseMonth(1)}><ChevronRight /></Button>
      </div>
      <div role="grid" aria-labelledby={monthId} aria-describedby={hintId} aria-multiselectable="true" onMouseLeave={() => setHovered(null)}>
        <div role="row" className="grid grid-cols-7">
          {weekdays.map(day => <span key={day} role="columnheader" className="py-1.5 text-center text-xs text-muted-foreground">{day}</span>)}
        </div>
        {Array.from({ length: weekCount }, (_, week) => <div role="row" key={week} className="grid grid-cols-7">
          {days.slice(week * 7, week * 7 + 7).map(day => {
            const start = day === preview.from;
            const end = day === preview.to;
            const inRange = !!preview.to && day >= preview.from && day <= preview.to;
            const selected = day === draft.from || (!!draft.to && day >= draft.from && day <= draft.to);
            return <div key={day} role="gridcell" aria-selected={selected} className={cn("flex justify-center", inRange && "bg-primary/15", start && "rounded-l-full", end && "rounded-r-full")}>
              <Button
                variant={start || end ? "default" : "ghost"}
                size="icon-sm"
                ref={node => { if (node) dayButtons.current.set(day, node); else dayButtons.current.delete(day); }}
                tabIndex={day === focused ? 0 : -1}
                aria-label={formatDate(day, true)}
                onClick={() => selectDay(day)}
                onMouseEnter={() => { if (anchor) setHovered(day); }}
                onKeyDown={event => moveFocus(event, day)}
                className={cn("rounded-full text-xs tabular-nums", !start && !end && day.slice(0, 7) !== month.slice(0, 7) && "text-muted-foreground")}
              >{parseDate(day).getUTCDate()}</Button>
            </div>;
          })}
        </div>)}
      </div>
                  <p className="mt-2 text-xs text-muted-foreground">Select one date, or a start and end.</p>
                </div> : <>
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Select a timeline</p>
                  <div className="flex flex-col gap-0.5" aria-label="Date range presets">
                    {presets.map(preset => {
                      const selected = draft.from === preset.range.from && draft.to === preset.range.to;
                      return <Button key={preset.label} variant="selection" size="sm" aria-pressed={selected} title={formatRange(preset.range)} onClick={() => choosePreset(preset.range)}>
                        {preset.label}{selected && <Check />}
                      </Button>;
                    })}
                    <Button ref={customButton} variant="selection" size="sm" aria-pressed={customSelected} aria-expanded={custom} aria-controls={calendarId} onClick={() => { setDirection(1); pendingFocus.current = true; setCustom(true); setAnchor(null); setHovered(null); }}>
                      Custom<ChevronRight />
                    </Button>
                  </div>
                </>}
              </ViewContent>
            </motion.div>
          </AnimatePresence>
          <motion.div layout={reducedMotion ? false : "position"} transition={sizeTransition} className="mt-2 flex items-center justify-between border-t border-border px-1 pt-2">
            {custom && <Button variant="ghost" size="sm" aria-label="Back to timeline presets" onClick={() => { setDirection(-1); pendingPresetFocus.current = true; pendingFocus.current = false; setCustom(false); setAnchor(null); setHovered(null); }}><ChevronLeft />Back</Button>}
            <Button size="sm" className="ml-auto" onClick={() => { onChange(draft); changeOpen(false); }}>Done</Button>
          </motion.div>
      </AutoSizePanel>
    </PopoverContent>
  </Popover>;
}
