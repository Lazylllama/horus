> [!NOTE]
> Here I'll document everytime i used AI to edit code for clarity and so I can see where my weakpoints are...

# One
ShadCN styling did not want to work whatsoever, turns out all I had to do was remove the `.next` folder and problems were fixed...

# Two
I was overflooding with errors in /components/ticket-table.tsx with gridspec not really working as expected and yada yada, spent too much time on debugging so left it to claude. Would've taken me an hour easy to fix everything... I blame their shitty docs.

# Three
I used `bun x drizzle-kit push` instead of using migrations by accident, asked claude to give me the query needed to fake the fact that I've run the migration...