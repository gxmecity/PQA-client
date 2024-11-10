import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppButton from './AppButton'
import { ModeToggle } from './ToggleTheme'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'

interface ListItem {
  children: any
  title: string
  url: string
  classname?: string
}

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className=' px-5 h-16 border-b border-b-border flex items-center gap-5 w-full max-w-full justify-start flex-none'>
      <MobileNav />
      <a href='/'>The Pub Quiz</a>
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
                <ListItem title='New Game Event' url=''>
                  A hosted quiz game to present to a group of people for a
                  perfect quiz night.
                </ListItem>
                {/* <ListItem url='/' title='New Series'>
                  A collection of game events prepared to keep track of players
                  lederboard over time.
                </ListItem> */}
                <ListItem url='/' title='Register Team'>
                  Register a new team to participate in your events
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
        <Avatar className=' sm:hidden'>
          <AvatarFallback className='bg-primary'>AK</AvatarFallback>
        </Avatar>
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

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className=' hidden sm:block'>
        <AppButton icon={<HamburgerMenuIcon />} variant='outline' />
      </SheetTrigger>
      <SheetContent className=' max-w-[450px]' side='left'>
        <SheetHeader>
          <p>The Pub quiz</p>
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

                  <ListItem url='/' title='Register Team'>
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
            <Avatar className=''>
              <AvatarFallback className='bg-primary'>AK</AvatarFallback>
            </Avatar>
            <small className='truncate'>Azubuike Kizto</small>
            <ChevronDown className=' ml-auto' />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
