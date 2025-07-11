
import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in [animation-delay:100ms]">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="VitallCheck-Up" className="h-10 w-auto" />
            </div>
            <p className="text-muted-foreground mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/vitallcheckup/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div className="animate-fade-in [animation-delay:200ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { name: t.nav.home, path: "/" },
                { name: t.nav.apartments, path: "/apartments" },
                { name: t.nav.blog, path: "/blog" },
                { name: t.nav.gallery, path: "/gallery" },
                { name: t.nav.contact, path: "/contact" },
                { name: t.nav.bookNow, path: "/booking" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in [animation-delay:300ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  R. Cel. Souza Franco, 904<br />
                  Centro, Mogi das Cruzes - SP<br />
                  08710-025
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">(11) 93455-0921</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">contato@vitallcheckup.com.br</span>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in [animation-delay:400ms]">
            <h4 className="text-xl font-bold mb-4">Nossa Localização</h4>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.1469087831845!2d-46.18634668502228!3d-23.52374348469487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce636f95ba937b%3A0x6b8b9d7c8e8e8e8e!2sR.%20Cel.%20Souza%20Franco%2C%20904%20-%20Centro%2C%20Mogi%20das%20Cruzes%20-%20SP%2C%2008710-025!5e0!3m2!1spt!2sbr!4v1234567890123!5m2!1spt!2sbr"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da VitallCheck-Up"
              ></iframe>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>📍 R. Cel. Souza Franco, 904</p>
              <p>Centro, Mogi das Cruzes - SP</p>
              <p>CEP: 08710-025</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} VitallCheck-Up. {t.footer.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
