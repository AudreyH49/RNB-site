'use client'

// Comps
import { Header } from "@codegouvfr/react-dsfr/Header";

// Auth
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';

// Routes
import { usePathname } from 'next/navigation'

export default function RNBHeader() {

  const { data: session } = useSession()

  const pathname = usePathname()

  const nav = [
    {
      isActive: pathname === '/',
      text: 'Accueil',
      linkProps: {
        href: '/',
      },

    },
    {
      isActive: pathname === '/carte',
      text: "Carte",
      linkProps: {
        href: '/carte',
      }
    },
    {
      isActive: pathname.startsWith('/outils-services'),
      text: "Outils & services",
      linkProps: {
        href: '/outils-services',
      }
    },
    {
      isActive: pathname === '/definition',
      text: "Définition & standards",
      linkProps: {
        href: '/definition',
      }
    },
    {
      isActive: pathname.startsWith('/cas'),
      text: "Cas d'usage",
      linkProps: {
        href: '/cas',
      }
    },
    {
      isActive: pathname.startsWith('/blog'),
      text: "Actualités",
      linkProps: {
        href: '/blog',
      }
    },
    {
      isActive: pathname === '/a-propos',
      text: "À propos",
      linkProps: {
        href: '/a-propos',
      }
    },
    {
      isActive: pathname === '/contact',
      text: "Contact",
      linkProps: {
        href: '/contact',
      }
    },
    {
      isActive: pathname === '/stats',
      text: "Statistiques",
      linkProps: {
        href: '/stats',
      }
    },
  ]

  const handleSignout = (e) => {
    e.preventDefault()
    signOut()
  }


  let logQA = {
    iconId: 'fr-icon-lock-line',
    linkProps: {
      href: '/login'
    },
    text: 'Se connecter'
  }

  if (session) {
    logQA = {
      iconId: 'fr-icon-logout-box-r-line',
      linkProps: {
        href: '#',
        onClick: (e) => { handleSignout(e) }
      },
      text: 'Se déconnecter'
    }
  }

  return (
    <>
      <Header
        brandTop={<>République<br />Française</>}
        serviceTitle="Référentiel National des Bâtiments"

        navigation={nav}
        homeLinkProps={{
          href: '/',
          title: 'Accueil RNB',
        }}
        quickAccessItems={[
          logQA
        ]}


      />
    </>
  )


}