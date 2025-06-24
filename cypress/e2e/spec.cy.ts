/// <reference types="cypress" />

describe('Music Hub - Complete E2E Tests', () => {
  beforeEach(() => {
    // Mock des données d'artistes
    cy.intercept('GET', '**/artists', { fixture: 'artists.json' }).as('getArtists');
  });

  describe('Navigation Tests', () => {
    it('should display the navbar correctly', () => {
      cy.visit('/');
      
      // Vérifier le branding
      cy.get('[data-cy=nav-brand]').should('contain', 'Music Hub');
      cy.get('[data-cy=brand-icon]').should('contain', '🎵');
      
      // Vérifier les liens de navigation
      cy.get('[data-cy=nav-home]').should('contain', 'Accueil');
      cy.get('[data-cy=nav-artists]').should('contain', 'Artistes');
    });

    it('should navigate between pages correctly', () => {
      cy.visit('/');
      
      // Vérifier page d'accueil active
      cy.get('[data-cy=nav-home]').should('have.class', 'active');
      cy.contains('Music Hub').should('be.visible');
      cy.contains('Découvrez l\'univers infini de la musique').should('be.visible');
      
      // Naviguer vers les artistes
      cy.get('[data-cy=nav-artists]').click();
      cy.url().should('include', '/artists');
      cy.get('[data-cy=nav-artists]').should('have.class', 'active');
      cy.get('[data-cy=nav-home]').should('not.have.class', 'active');
      
      // Retour à l'accueil
      cy.get('[data-cy=nav-home]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('[data-cy=nav-home]').should('have.class', 'active');
    });
  });

  describe('Homepage (Accueil) Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display hero section correctly', () => {
      cy.get('[data-cy=hero-title]').should('contain', 'Music Hub');
      cy.get('[data-cy=hero-subtitle]').should('contain', 'Découvrez l\'univers infini de la musique');
      cy.get('[data-cy=hero-image]').should('be.visible');
      cy.get('[data-cy=hero-image]').should('have.attr', 'alt', 'Music');
    });

    it('should toggle info card when explore button is clicked', () => {
      // État initial
      cy.get('[data-cy=explore-btn]').should('contain', 'Explorer');
      cy.get('[data-cy=info-card]').should('not.exist');
      
      // Cliquer sur Explorer
      cy.get('[data-cy=explore-btn]').click();
      
      // Vérifier le changement
      cy.get('[data-cy=explore-btn]').should('contain', 'Réduire');
      cy.get('[data-cy=info-card]').should('be.visible');
      cy.get('[data-cy=info-card]').should('contain', 'Une expérience musicale immersive');
      cy.get('[data-cy=info-card]').should('contain', 'Découvrez une collection exceptionnelle');
      
      // Cliquer sur Réduire
      cy.get('[data-cy=explore-btn]').click();
      
      // Retour à l'état initial
      cy.get('[data-cy=explore-btn]').should('contain', 'Explorer');
      cy.get('[data-cy=info-card]').should('not.exist');
    });

    it('should have responsive design elements', () => {
      // Test desktop
      cy.viewport(1280, 720);
      cy.get('[data-cy=hero-image]').should('be.visible');
      
      // Test tablet
      cy.viewport(768, 1024);
      cy.get('[data-cy=hero-title]').should('be.visible');
      
      // Test mobile
      cy.viewport(375, 667);
      cy.get('[data-cy=hero-title]').should('be.visible');
      cy.get('[data-cy=explore-btn]').should('be.visible');
    });
  });

  describe('Artists Page Tests', () => {
    beforeEach(() => {
      cy.visit('/artists');
    });

    it('should display the artists page correctly', () => {
      cy.wait('@getArtists');
      
      cy.get('[data-cy=page-title]').should('contain', 'Nos Artistes');
      cy.get('[data-cy=page-subtitle]').should('contain', 'Découvrez notre collection d\'artistes exceptionnels');
    });

    it('should display loading state initially', () => {
      // Intercept avec delay pour voir le loading
      cy.intercept('GET', '**/artists', { 
        fixture: 'artists.json', 
        delay: 2000 
      }).as('getArtistsDelay');
      
      cy.visit('/artists');
      
      cy.get('[data-cy=loading-spinner]').should('be.visible');
      cy.get('[data-cy=loading-text]').should('contain', 'Chargement des artistes...');
      
      cy.wait('@getArtistsDelay');
      cy.get('[data-cy=loading-spinner]').should('not.exist');
    });

    it('should display artists correctly after loading', () => {
      cy.wait('@getArtists');
      
      // Vérifier que les artistes sont affichés
      cy.get('[data-cy=artist-card]').should('have.length', 3);
      
      // Vérifier les noms des artistes
      cy.get('[data-cy=artist-card]').first().should('contain', 'Justice');
      cy.get('[data-cy=artist-card]').eq(1).should('contain', 'Deadmau5');
      cy.get('[data-cy=artist-card]').eq(2).should('contain', 'Savant');
      
      // Vérifier que les images sont présentes
      cy.get('[data-cy=artist-photo]').should('have.length', 3);
      cy.get('[data-cy=artist-photo]').each(($img) => {
        cy.wrap($img).should('have.attr', 'src').and('not.be.empty');
        cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
      });
    });

    it('should show delete button on hover', () => {
      cy.wait('@getArtists');
      
      // Hover sur la première carte
      cy.get('[data-cy=artist-card]').first().trigger('mouseover');
      cy.get('[data-cy=delete-btn]').first().should('be.visible');
      
      // Vérifier l'icône de suppression
      cy.get('[data-cy=delete-btn]').first().find('[data-cy=delete-icon]').should('contain', '🗑️');
    });

    it('should handle API error correctly', () => {
      cy.intercept('GET', '**/artists', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getArtistsError');
      
      cy.visit('/artists');
      cy.wait('@getArtistsError');
      
      cy.get('[data-cy=error-container]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', 'Impossible de charger les artistes');
      cy.get('[data-cy=retry-btn]').should('be.visible');
    });

    it('should retry loading artists when retry button is clicked', () => {
      // Premier appel en erreur
      cy.intercept('GET', '**/artists', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getArtistsError');
      
      cy.visit('/artists');
      cy.wait('@getArtistsError');
      
      // Deuxième appel réussi
      cy.intercept('GET', '**/artists', { fixture: 'artists.json' }).as('getArtistsRetry');
      
      cy.get('[data-cy=retry-btn]').click();
      cy.wait('@getArtistsRetry');
      
      cy.get('[data-cy=artist-card]').should('have.length', 3);
    });
  });

  describe('Artist Form Tests', () => {
    beforeEach(() => {
      cy.visit('/artists');
      cy.wait('@getArtists');
    });

    it('should display the form correctly', () => {
      cy.get('[data-cy=form-header]').should('contain', 'Ajouter un artiste');
      cy.get('[data-cy=form-description]').should('contain', 'Partagez votre découverte musicale');
      
      cy.get('[data-cy=artist-name-input]').should('have.attr', 'placeholder', 'Ex: Daft Punk');
      cy.get('[data-cy=artist-photo-input]').should('have.attr', 'placeholder', 'https://exemple.com/photo.jpg');
      
      cy.get('[data-cy=submit-btn]').should('contain', 'Ajouter l\'artiste');
    });

    it('should validate form inputs correctly', () => {
      // Tester les champs vides
      cy.get('[data-cy=artist-name-input]').focus().blur();
      cy.get('[data-cy=artist-photo-input]').focus().blur();
      
      cy.get('[data-cy=error-message]').should('have.length', 2);
      cy.get('[data-cy=submit-btn]').should('be.disabled');
      
      // Tester nom trop court
      cy.get('[data-cy=artist-name-input]').type('A');
      cy.get('[data-cy=error-message]').should('contain', 'minimum 2 caractères');
      
      // Tester URL invalide
      cy.get('[data-cy=artist-photo-input]').type('invalid-url');
      cy.get('[data-cy=error-message]').should('contain', 'URL de la photo');
      
      // Form valide
      cy.get('[data-cy=artist-name-input]').clear().type('Valid Artist');
      cy.get('[data-cy=artist-photo-input]').clear().type('https://example.com/valid.jpg');
      
      cy.get('[data-cy=submit-btn]').should('not.be.disabled');
    });

    it('should add a new artist successfully', () => {
      // Mock pour la création
      cy.intercept('POST', '**/artists', {
        id: 'new-id-123',
        name: 'New Artist',
        photo: 'https://example.com/photo.jpg'
      }).as('createArtist');

      // Remplir le formulaire
      cy.get('[data-cy=artist-name-input]').type('New Artist');
      cy.get('[data-cy=artist-photo-input]').type('https://example.com/photo.jpg');
      
      // Vérifier que le bouton est enabled
      cy.get('[data-cy=submit-btn]').should('not.be.disabled');
      
      // Soumettre
      cy.get('[data-cy=submit-btn]').click();
      
      cy.wait('@createArtist');
      
      // Vérifier que l'artiste est ajouté (le nouvel artiste sera en premier)
      cy.get('[data-cy=artist-card]').should('have.length', 4);
      cy.get('[data-cy=artist-card]').first().should('contain', 'New Artist');
      
      // Vérifier que le form est reset
      cy.get('[data-cy=artist-name-input]').should('have.value', '');
      cy.get('[data-cy=artist-photo-input]').should('have.value', '');
    });

    it('should handle add artist error', () => {
      cy.intercept('POST', '**/artists', {
        statusCode: 400,
        body: { error: 'Validation failed' }
      }).as('createArtistError');

      cy.get('[data-cy=artist-name-input]').type('Test Artist');
      cy.get('[data-cy=artist-photo-input]').type('https://example.com/test.jpg');
      cy.get('[data-cy=submit-btn]').click();
      
      cy.wait('@createArtistError');
      
      cy.get('[data-cy=error-message]').should('contain', 'Impossible d\'ajouter l\'artiste');
    });
  });

  describe('Artist Delete Tests', () => {
    beforeEach(() => {
      cy.visit('/artists');
      cy.wait('@getArtists');
    });

    it('should delete an artist successfully when there are enough artists', () => {
      // Mock avec 4 artistes pour permettre la suppression
      cy.intercept('GET', '**/artists', { fixture: 'artists-with-four.json' }).as('getArtistsWithFour');
      cy.visit('/artists');
      cy.wait('@getArtistsWithFour');
      
      // Mock pour la suppression réussie
      cy.intercept('DELETE', '**/artists/*', {
        statusCode: 200
      }).as('deleteArtistSuccess');

      // Hover et cliquer sur delete
      cy.get('[data-cy=artist-card]').first().trigger('mouseover');
      cy.get('[data-cy=delete-btn]').first().click();
      
      cy.wait('@deleteArtistSuccess');
      
      // Vérifier que l'artiste est supprimé
      cy.get('[data-cy=artist-card]').should('have.length', 3);
    });

    it('should handle delete error when less than 4 artists', () => {
      // Mock erreur de suppression
      cy.intercept('DELETE', '**/artists/*', {
        statusCode: 400,
        body: { error: 'Cannot delete - minimum 4 artists required' }
      }).as('deleteArtistError');

      // Tenter de supprimer
      cy.get('[data-cy=artist-card]').first().trigger('mouseover');
      cy.get('[data-cy=delete-btn]').first().click();
      
      cy.wait('@deleteArtistError');
      
      // Vérifier l'erreur
      cy.get('[data-cy=error-message]').should('contain', 'Impossible de supprimer l\'artiste');
      cy.get('[data-cy=retry-btn]').should('be.visible');
      
      // Vérifier que l'artiste n'est pas supprimé
      cy.get('[data-cy=artist-card]').should('have.length', 3);
    });
  });

  describe('Responsive Design Tests', () => {
    const viewports = [
      { device: 'Desktop', width: 1280, height: 720 },
      { device: 'Tablet', width: 768, height: 1024 },
      { device: 'Mobile', width: 375, height: 667 }
    ];

    viewports.forEach(({ device, width, height }) => {
      it(`should display correctly on ${device}`, () => {
        cy.viewport(width, height);
        
        // Test homepage
        cy.visit('/');
        cy.get('[data-cy=nav-brand]').should('be.visible');
        cy.get('[data-cy=hero-title]').should('be.visible');
        cy.get('[data-cy=explore-btn]').should('be.visible');
        
        // Test artists page
        cy.visit('/artists');
        cy.wait('@getArtists');
        cy.get('[data-cy=page-title]').should('be.visible');
        cy.get('[data-cy=artist-card]').should('be.visible');
        cy.get('[data-cy=artist-name-input]').should('be.visible');
      });
    });
  });

  describe('Performance and UX Tests', () => {
    it('should load pages quickly', () => {
      const startTime = Date.now();
      
      cy.visit('/');
      cy.get('[data-cy=hero-title]').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 secondes max
      });
    });

    it('should handle navigation smoothly', () => {
      cy.visit('/');
      
      // Navigation rapide entre les pages
      cy.get('[data-cy=nav-artists]').click();
      cy.url().should('include', '/artists');
      
      cy.get('[data-cy=nav-home]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Vérifier que les éléments sont bien visibles
      cy.get('[data-cy=hero-title]').should('be.visible');
    });

    it('should handle multiple rapid clicks gracefully', () => {
      cy.visit('/');
      
      // Clics rapides sur le bouton explore
      cy.get('[data-cy=explore-btn]').click().click().click();
      
      // L'état final devrait être cohérent
      cy.get('[data-cy=explore-btn]').should('contain', 'Réduire');
      cy.get('[data-cy=info-card]').should('be.visible');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels and semantic HTML', () => {
      cy.visit('/');
      
      // Vérifier les éléments sémantiques
      cy.get('nav').should('exist');
      cy.get('h1').should('exist');
      cy.get('img').should('have.attr', 'alt');
      cy.get('button').should('be.visible');
    });

    it('should be keyboard navigable', () => {
  cy.visit('/');
  
  // Navigation au clavier native avec {tab}
  cy.get('body').type('{tab}');
  cy.focused().should('contain', 'Accueil');
  
  cy.focused().type('{tab}');
  cy.focused().should('contain', 'Artistes');
  
  cy.focused().type('{tab}');
  cy.focused().should('contain', 'Explorer');
});
  });

  describe('Edge Cases Tests', () => {
    it('should handle empty artist list', () => {
      cy.intercept('GET', '**/artists', { body: [] }).as('getEmptyArtists');
      
      cy.visit('/artists');
      cy.wait('@getEmptyArtists');
      
      cy.get('[data-cy=empty-state]').should('be.visible');
      cy.get('[data-cy=empty-message]').should('contain', 'Aucun artiste trouvé');
      cy.get('[data-cy=empty-icon]').should('contain', '🎵');
    });

    it('should handle long artist names gracefully', () => {
      cy.intercept('GET', '**/artists', {
        body: [{
          id: 'long-name-id',
          name: 'Super Ultra Mega Long Artist Name That Should Not Break The Layout',
          photo: 'https://example.com/photo.jpg'
        }]
      }).as('getLongNameArtist');
      
      cy.visit('/artists');
      cy.wait('@getLongNameArtist');
      
      cy.get('[data-cy=artist-card]').should('be.visible');
      cy.get('[data-cy=artist-name]').should('contain', 'Super Ultra Mega Long');
    });

    it('should handle broken image URLs', () => {
      cy.intercept('GET', '**/artists', {
        body: [{
          id: 'broken-image-id',
          name: 'Broken Image Artist',
          photo: 'https://broken-url-that-does-not-exist.com/image.jpg'
        }]
      }).as('getBrokenImageArtist');
      
      cy.visit('/artists');
      cy.wait('@getBrokenImageArtist');
      
      cy.get('[data-cy=artist-card]').should('be.visible');
      cy.get('[data-cy=artist-name]').should('contain', 'Broken Image Artist');
    });
  });
});