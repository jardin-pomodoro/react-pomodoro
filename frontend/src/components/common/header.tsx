/* eslint-disable import/prefer-default-export */
import {
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Loader,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './header.css';
import { IconUser, IconCurrencyEthereum } from '@tabler/icons';
import { Link } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.dark[8],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      color: theme.colors.gray[0],
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.teal[8],
    },
  },
  account: {
    overflow: 'hidden',
    WhiteSpace: 'nowrap',
    width: '10rem',
  },

  linkLabel: {
    marginRight: 5,
  },
}));

interface HeaderSearchProps {
  links: {
    link: string;
    label: string;
    links: { link: string; label: string }[];
  }[];
  // eslint-disable-next-line react/require-default-props
  moneyCount?: number;
}

export function HeaderMenu({ links, moneyCount }: HeaderSearchProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = links.map((link) => {
    return (
      <Link key={link.label} to={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  });

  return (
    <Header className="header" height={56} mb={120}>
      <Container size="xl">
        <div className={classes.inner}>
          <Text c="teal.8" fz="lg">
            NFT-Pomodoro
          </Text>

          <Group spacing={5} className={classes.links}>
            {items}
            {moneyCount && moneyCount !== -1 && (
              <>
                <IconCurrencyEthereum />
                <div>{moneyCount}</div>
              </>
            )}
            {moneyCount && moneyCount === -1 && (
              <>
                <IconCurrencyEthereum />
                <Loader color="black" size="sm" />
              </>
            )}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        </div>
      </Container>
    </Header>
  );
}
