# Mission Alignment Guide

## 🎯 The Most Important Question

**Before writing a single line of code, answer this:**

> "If I build this perfectly, whose life gets measurably better?"

If you can't answer this specifically, stop. Think more.

## 🔍 The C2C Mission Alignment Framework

### Step 1: Identify Your User

❌ **Bad**: "People who need help"  
❌ **Bad**: "Everyone"  
❌ **Bad**: "Small businesses"

✅ **Good**: "Single parents working night shifts who struggle to find emergency childcare"  
✅ **Good**: "People with visual impairments trying to navigate public transportation"  
✅ **Good**: "High school students whose first language isn't English applying to college"

**Your Turn**: Write one specific sentence about WHO you're serving.

```
I am building for: _______________________________________________
```

### Step 2: Define the Barrier

What specific obstacle are they facing RIGHT NOW?

❌ **Bad**: "They need more resources"  
❌ **Bad**: "The current system is broken"

✅ **Good**: "They lose 3 hours per week calling individual daycares only to find they're full"  
✅ **Good**: "They miss buses because announcements aren't in braille or audio"  
✅ **Good**: "They don't know which documents they need or how to write personal statements"

**Your Turn**: What specific problem are they experiencing?

```
The barrier they face is: _______________________________________
```

### Step 3: Measure the Impact

How will you KNOW if you've helped?

❌ **Bad**: "They'll be happier"  
❌ **Bad**: "It will be easier"

✅ **Good**: "They'll save 2+ hours per week finding childcare"  
✅ **Good**: "They'll miss 50% fewer buses"  
✅ **Good**: "Application completion rate increases from 30% to 75%"

**Your Turn**: What will measurably improve?

```
Success means: _________________________________________________
```

### Step 4: Ensure Accessibility

Can they actually USE what you're building?

Ask yourself:
- [ ] Can they afford it? (Free or under $10/month)
- [ ] Do they have the technology? (Works on old phones?)
- [ ] Is it in their language?
- [ ] Is it accessible? (Screen readers, large text, simple language)
- [ ] Can they find it? (Where do they already look for help?)
- [ ] Do they trust it? (Privacy, security, cultural sensitivity)

**Your Turn**: What might prevent them from using this?

```
Potential barriers: ____________________________________________
```

### Step 5: Sustainability Check

Can you actually maintain this?

- [ ] Can you build it in 2-4 weeks?
- [ ] Will it cost less than $20/month to run?
- [ ] Can you support users without burning out?
- [ ] Do you have a plan if it grows beyond you?

## 📋 The Mission Alignment Checklist

Before starting development, you must be able to check ALL of these:

```
□ I can describe my specific user in one sentence
□ I can explain their barrier in concrete terms
□ I have a measurable definition of success
□ They can afford to use this (free or <$10/month)
□ It works on devices they actually have
□ I've talked to at least 3 people who have this problem
□ I know where to find more people with this problem
□ I can build a simple version in 2-4 weeks
□ I can run this for under $20/month
□ I have a plan to measure if it's actually helping
```

If you can't check all boxes, **that's okay**. It means you need to:
- Talk to more potential users
- Simplify your idea
- Focus on one specific outcome
- Think smaller (for now)

## ❌ Common Mission Alignment Mistakes

### Mistake #1: "Everybody" Disease
**Wrong**: "This helps everyone manage their time better"  
**Right**: "This helps hourly workers with unpredictable schedules trade shifts without losing pay"

### Mistake #2: Solution Looking for Problem
**Wrong**: "I learned AI, so I want to build an AI app"  
**Right**: "I know teachers spend 10 hours/week grading, so I want to help automate that"

### Mistake #3: Building for Yourself
**Wrong**: "I'm a developer who wants better tools"  
**Right**: "I'm a developer who saw my mom struggle with X, and I want to help people like her"

(Building for yourself is fine IF you represent an underserved community)

### Mistake #4: Scope Creep
**Wrong**: "I'll solve poverty by building a platform that..."  
**Right**: "I'll help 50 people in my neighborhood find one food resource this month"

### Mistake #5: Ignoring the "$100" Reality
**Wrong**: "Users will pay $50/month because this provides so much value"  
**Right**: "This is free because my users literally don't have $50/month"

## ✅ Good Mission Alignment Examples

### Example 1: "Bus Buddy"
- **Who**: Blind commuters in my city
- **Barrier**: Can't tell which bus is arriving without asking strangers
- **Impact**: Catch correct bus 95% of the time (up from 60%)
- **Accessible**: Free, audio-first design, works on any phone
- **Sustainable**: Uses free transit APIs, <$5/month hosting

### Example 2: "Shift Swap"
- **Who**: Fast food workers at my local chain
- **Barrier**: Lose 2-4 hours of pay per month because they can't find shift coverage
- **Impact**: Workers keep 90% of their scheduled hours (up from 75%)
- **Accessible**: SMS-based (no smartphone needed), Spanish + English
- **Sustainable**: $10/month Twilio bill, manager sponsors it

### Example 3: "College Docs"
- **Who**: First-gen college applicants at my old high school
- **Barrier**: Don't know what documents they need or how to get them
- **Impact**: 80% complete applications (up from 30%)
- **Accessible**: Free, works on school computers, saves progress
- **Sustainable**: School counselor helps maintain it, $15/month hosting

## 🎯 Your Mission Statement Template

Fill this out BEFORE coding:

```markdown
## My Mission Statement

**Application Name**: _______________________

**I am building for**: 
[One specific sentence about your users]

**The problem they face**:
[Specific, observable barrier]

**How I'll measure success**:
[Concrete, measurable outcome]

**Why they can use this**:
- Cost: [Free or specific price under $10]
- Access: [What devices/tech they need]
- Language: [What languages supported]
- Discovery: [How they'll find it]

**Why this is sustainable**:
- Build time: [2-4 weeks estimated]
- Monthly cost: [Under $20/month]
- Support plan: [How I'll help users]
- Growth plan: [What if 100 people use it?]

**My commitment**:
I commit to building this to genuinely serve my users, not to get rich or famous. I will measure impact honestly and adjust if I'm not actually helping.

Signed: _________________ Date: _________
```

## 🚀 Next Steps

Once you have strong mission alignment:

1. **Validate**: Show your mission statement to 3-5 potential users. Do they agree this would help?

2. **Simplify**: Look at your feature list. Cut everything except the ONE thing that removes the barrier.

3. **Design**: Sketch your UI on paper. Show it to potential users. Adjust.

4. **Build**: Now you're ready to start coding!

---

**Remember**: Code is easy to change. Mission alignment is hard to fix later. Take your time here.

Next: [Database Design →](./03-DATABASE-DESIGN.md)
