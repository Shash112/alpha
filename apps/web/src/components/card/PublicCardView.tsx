'use client';

import React from 'react';
import {
  Download,
  Share2,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Avatar, Button } from '@/components/ui';

export interface PublicCardViewProps {
  name: string;
  designation?: string;
  company?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
    whatsapp?: string;
  };
  brandAccent?: string;
  publicId?: string;
  canonicalUrl?: string;
  vcardDownloadUrl?: string;
  onSaveContact?: () => void;
  onExchangeDetails?: () => void;
  isPreview?: boolean;
}

export const PublicCardView: React.FC<PublicCardViewProps> = ({
  name,
  designation,
  company,
  bio,
  avatarUrl,
  phone,
  email,
  website,
  socials,
  brandAccent = '#0F172A',
  publicId,
  canonicalUrl,
  vcardDownloadUrl,
  onSaveContact,
  onExchangeDetails,
  isPreview = false
}) => {
  const {
    linkedin: socialLinkedin,
    twitter: socialTwitter,
    instagram: socialInstagram,
    github: socialGithub,
    youtube: socialYoutube,
    whatsapp: socialWhatsapp
  } = socials || {};

  const hasContacts = Boolean(phone || email || website);
  const hasSocials = Boolean(
    socialLinkedin || socialTwitter || socialInstagram || socialGithub || socialYoutube || socialWhatsapp
  );

  return (
    <div className={`w-full bg-white text-slate-900 ${isPreview ? 'p-5 space-y-4' : 'p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5'}`}>
      {/* Avatar & Hero Info */}
      <div className="text-center space-y-3">
        <Avatar
          src={avatarUrl}
          name={name || 'Digital Profile'}
          size={isPreview ? 'lg' : 'xl'}
          accentColor={brandAccent}
          className="mx-auto"
        />

        <div className="space-y-0.5">
          <h1 className={`${isPreview ? 'text-base font-extrabold' : 'text-2xl font-extrabold'} text-slate-900 tracking-tight`}>
            {name || 'Your Name'}
          </h1>

          {(designation || company) && (
            <p className="text-xs font-semibold text-slate-600">
              {designation}
              {designation && company ? ' • ' : ''}
              {company && <span className="text-slate-500 font-normal">{company}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className={`${isPreview ? 'text-[11px]' : 'text-xs'} text-slate-500 text-center font-normal leading-relaxed max-w-xs mx-auto`}>
          {bio}
        </p>
      )}

      {/* Action Suite */}
      <div className="space-y-2 pt-1">
        {vcardDownloadUrl ? (
          <a
            href={vcardDownloadUrl}
            download
            className={`w-full py-2.5 rounded-xl font-bold text-xs text-white text-center shadow-2xs transition hover:opacity-95 active:scale-[0.98] flex items-center justify-center space-x-2`}
            style={{ backgroundColor: brandAccent }}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Save Contact</span>
          </a>
        ) : (
          <div
            onClick={onSaveContact}
            className={`w-full py-2.5 rounded-xl font-bold text-xs text-white text-center shadow-2xs flex items-center justify-center space-x-2 cursor-pointer`}
            style={{ backgroundColor: brandAccent }}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Save Contact</span>
          </div>
        )}

        {onExchangeDetails ? (
          <Button
            variant="secondary"
            fullWidth
            size={isPreview ? 'sm' : 'md'}
            onClick={onExchangeDetails}
            leftIcon={<Share2 className="w-3.5 h-3.5 text-slate-500" />}
          >
            Exchange Details
          </Button>
        ) : (
          <div className="w-full text-center py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs bg-slate-50 flex items-center justify-center space-x-1.5">
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Exchange Details</span>
          </div>
        )}
      </div>

      {/* Contact Rows */}
      {hasContacts && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 px-1">Contact</div>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-900 transition"
            >
              <div className="flex items-center space-x-2 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Call</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-900 transition"
            >
              <div className="flex items-center space-x-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Email</span>
            </a>
          )}

          {website && (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-900 transition"
            >
              <div className="flex items-center space-x-2 truncate">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{website}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Website</span>
            </a>
          )}
        </div>
      )}

      {/* Social Links */}
      {hasSocials && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 px-1">Connect</div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {socialLinkedin && (
              <a
                href={socialLinkedin.startsWith('http') ? socialLinkedin : `https://${socialLinkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
              >
                <Linkedin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">LinkedIn</span>
              </a>
            )}

            {socialTwitter && (
              <a
                href={socialTwitter.startsWith('http') ? socialTwitter : `https://${socialTwitter}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
              >
                <Twitter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">X</span>
              </a>
            )}

            {socialInstagram && (
              <a
                href={socialInstagram.startsWith('http') ? socialInstagram : `https://${socialInstagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Instagram</span>
              </a>
            )}

            {socialGithub && (
              <a
                href={socialGithub.startsWith('http') ? socialGithub : `https://${socialGithub}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">GitHub</span>
              </a>
            )}

            {socialYoutube && (
              <a
                href={socialYoutube.startsWith('http') ? socialYoutube : `https://${socialYoutube}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">YouTube</span>
              </a>
            )}

            {socialWhatsapp && (
              <a
                href={socialWhatsapp.startsWith('http') ? socialWhatsapp : `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition truncate"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Canonical identifier line */}
      {(canonicalUrl || publicId) && (
        <div className="pt-2 text-center border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-mono tracking-wide">
            {canonicalUrl || `alpha.me/c/${publicId}`}
          </span>
        </div>
      )}
    </div>
  );
};
