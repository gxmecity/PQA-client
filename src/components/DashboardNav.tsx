import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLogo from './AppLogo'
import { ModeToggle } from './ToggleTheme'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import AppAvater from './AppAvater'

interface ListItem {
  children: any
  title: string
  url: string
  classname?: string
}

interface Props {
  name: string
}

export function NavigationMenuDemo({ name }: Props) {
  return (
    <NavigationMenu className=' px-5 h-16 border-b border-b-border flex items-center gap-5 w-full max-w-full justify-start flex-none'>
      <MobileNav name={name} />
      <Link to='/dashboard' className=' block w-16'>
        <AppLogo />
      </Link>
      <NavigationMenuList className=' sm:hidden'>
        <NavigationMenuItem>
          <>
            <NavigationMenuTrigger>Create</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid gap-3 p-4 md:w-[400px] w-[500px] grid-cols-[.75fr_1fr]'>
                <li className='row-span-3'>
                  <NavigationMenuLink asChild>
                    <a
                      className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md'
                      href='/'>
                      <div className='mb-2 mt-4 text-lg font-medium'>
                        The Pub Quiz
                      </div>
                      <p className='text-sm leading-tight text-foreground'>
                        On-the-go quiz app to challenge friends and test your
                        knowledge.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem url='/dashboard/create-quiz' title='New Quiz Game'>
                  A specific and ordered list of questions in rounds to use on
                  game events.
                </ListItem>

                <ListItem url='/dashboard/teams' title='Register Team'>
                  Register a new team to participate in your events
                </ListItem>
                <ListItem url='/' title='New Series'>
                  A collection of game events prepared to keep track of players
                  lederboard over time.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to='/dashboard/quiz'>My Quiz</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to='/dashboard/events'>My Events</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to='/dashboard/series'>My Series</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className='ml-auto flex gap-3 items-center'>
        <ModeToggle />

        <AppAvater fallbackText={name} />
      </div>
    </NavigationMenu>
  )
}

const ListItem = ({ title, url, children, classname }: ListItem) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={url}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            classname
          )}>
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className=' text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
ListItem.displayName = 'ListItem'

const MobileNav = ({ name }: Props) => {
  return (
    <Sheet>
      <SheetTrigger className=' hidden sm:flex' asChild>
        <span className=' cursor-pointer border rounded-md  border-text-forground items-center justify-center w-8 h-8'>
          <HamburgerMenuIcon />
        </span>
      </SheetTrigger>
      <SheetContent className=' max-w-[450px]' side='left'>
        <SheetHeader>
          <SheetTitle>The Pub quiz</SheetTitle>
          <SheetDescription>
            On-the-go quiz app to challenge friends and test your knowledge.
          </SheetDescription>
        </SheetHeader>
        <div className=' flex flex-col justify-start h-full pb-10'>
          <NavigationMenuList className=' flex flex-col pt-8 space-y-5'>
            <NavigationMenuItem className=' w-full'>
              <Collapsible>
                <CollapsibleTrigger className=' w-full flex justify-between items-center'>
                  Create <ChevronDown />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ListItem url='/dashboard/create-quiz' title='New Quiz Game'>
                    A specific and ordered list of questions in rounds to use on
                    game events.
                  </ListItem>
                  <ListItem title='New Game Event' url=''>
                    A hosted quiz game to present to a group of people for a
                    perfect quiz night.
                  </ListItem>

                  <ListItem url='/dashboard/teams' title='Register Team'>
                    Register a new team to participate in your events
                  </ListItem>
                </CollapsibleContent>
              </Collapsible>
            </NavigationMenuItem>

            <NavigationMenuItem className='w-full'>
              <NavigationMenuLink asChild className=''>
                <Link to='/dashboard/quiz'>My Quiz</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className='w-full'>
              <NavigationMenuLink asChild className=''>
                <Link to='/'>My Events</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className='w-full'>
              <NavigationMenuLink asChild className=''>
                <Link to='/'>My Series</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <div className='mt-auto flex gap-3 items-center'>
            <AppAvater fallbackText={name} />
            <small className='truncate'>Azubuike Kizto</small>
            <ChevronDown className=' ml-auto' />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
