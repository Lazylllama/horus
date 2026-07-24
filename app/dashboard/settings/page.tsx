"use client";

import { useState } from "react";
import ErrorFallback from "@/app/error-boundary";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { LinkHref, PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type SettingsSection = keyof typeof Sections;

const Sections = {
  Identity: {
    label: "Identity",
    description: "Manage your instance identity across the platform.",
    destructive: false,
  },
  Nephthys: {
    label: "Nephthys",
    description:
      "Setup your nephthys instance and configure your slack channel.",
    destructive: false,
  },
  Jelly: {
    label: "Jelly",
    description: "Configure your Jelly team and manage your configuration.",
    destructive: false,
  },
  Danger: {
    label: "Danger",
    description:
      "Irreversible zone, manage your instance and delete it if you wish.",
    destructive: true,
  },
} as const;

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("Identity");

  function scrollToSection(sectionId: string) {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleSectionChange(section: SettingsSection) {
    setActiveSection(section);
    scrollToSection(section.toLowerCase());
  }

  return (
    <>
      <Navbar />
      <ErrorFallback title={"SETTINGS ERR"}>
        <PageWrapper variant="tight">
          <PageHeader title="Settings" breadcrumb="SETTINGS">
            <PageDescription>Manage your instance settings.</PageDescription>
          </PageHeader>
          <div className="grid grid-cols-4 gap-4 py-2">
            <div className="col-span-1">
              <div className="flex flex-col gap-1">
                {Object.entries(Sections).map(([key, section]) => (
                  <button
                    type="button"
                    key={key}
                    className={cn(
                      "transition-all",
                      "text-left text-md font-bold text-muted-foreground hover:text-foreground",
                      "border-l-4 px-4 py-2",
                      activeSection === key
                        ? "border-primary text-foreground"
                        : "border-muted",
                    )}
                    onClick={() => handleSectionChange(key as SettingsSection)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-3">
              <div
                className="flex flex-col gap-6"
                id={activeSection.toLowerCase()}
              >
                <SettingsSection section={"Identity"}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <SettingLabel
                        htmlFor="display-name"
                        label="Display Name"
                      />
                      <Input
                        id="display-name"
                        placeholder="Enter display name"
                      />
                    </div>
                    <div>
                      <SettingLabel
                        htmlFor="instance-slug"
                        label="Instance Slug"
                      />
                      <Input
                        id="instance-slug"
                        placeholder="Enter instance slug"
                      />
                    </div>
                  </div>
                  <div>
                    <SettingLabel htmlFor="image-url" label="Image URL" />
                    <Input
                      id="image-url"
                      placeholder="Enter image URL"
                      type="url"
                    />
                  </div>
                  <SettingToggle
                    label="Instance Transparency"
                    description=" show your instance to the public or not. Doesn't do squat yet :)"
                    id="instance-transparency"
                  />
                </SettingsSection>
                <SettingsSection section={"Nephthys"}>
                  <div>
                    <SettingLabel
                      htmlFor="nephthys-slack-channel"
                      label="Slack Channel"
                    />
                    <Input
                      id="nephthys-slack-channel"
                      placeholder="Enter slack channel ID"
                    />
                  </div>
                  <div>
                    <SettingLabel
                      htmlFor="nephthys-host-url"
                      label="Nephthys Host URL"
                    />
                    <Field id="nephthys-host-url">
                      <InputGroup>
                        <InputGroupInput
                          id="input-group-url"
                          placeholder="example.com"
                        />
                        <InputGroupAddon>
                          <InputGroupText>https://</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  </div>
                </SettingsSection>
                <SettingsSection section={"Jelly"}>
                  <div>
                    <SettingLabel
                      htmlFor="jelly-api-key"
                      label="Jelly API Key"
                    />
                    <Input
                      id="jelly-api-key"
                      placeholder="Enter jelly api key"
                      type="password"
                    />
                    <SettingDescription>
                      You can fetch your key on the{" "}
                      <LinkHref href="https://app.letsjelly.com/">
                        Jelly Dashboard
                      </LinkHref>
                    </SettingDescription>
                  </div>
                </SettingsSection>
                <SettingsSection section={"Danger"}>
                  <LargeSettingButton
                    label="Transfer Instance"
                    description="Move the sponsor role to another user. This will transfer the instance ownership to the new user."
                    onClick={() => {
                      console.log("uhh 2");
                    }}
                  />
                  <LargeSettingButton
                    label="Delete Instance"
                    description="This will permanently delete the instance and all associated data."
                    onClick={() => {
                      console.log("uhh");
                    }}
                    destructive
                  />
                </SettingsSection>
              </div>
            </div>
          </div>
        </PageWrapper>
      </ErrorFallback>
      <Footer />
    </>
  );
}

function SettingsSection({
  section,
  children,
}: {
  section: SettingsSection;
  children: React.ReactNode;
}) {
  const sectionData = Sections[section] || {
    label: "Unknown Section",
    description: "This section does not exist.",
    destructive: false,
    toggleable: false,
  };

  return (
    <Card
      id={section.toLowerCase()}
      className={cn(
        "w-full border-2",
        sectionData.destructive && "border-destructive",
      )}
    >
      <CardHeader>
        <div>
          <h1 className="text-lg">{sectionData.label}</h1>
          <p className="text-muted-foreground font-sans">
            {sectionData.description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

function SettingLabel({ label, htmlFor }: { label: string; htmlFor: string }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-sm font-bold text-muted-foreground pb-1"
    >
      {label}
    </Label>
  );
}

function SettingDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs mt-1 text-muted-foreground tracking-wide">
      {children}
    </p>
  );
}

function SettingToggle({
  label,
  description,
  id,
}: {
  label: string;
  description: string;
  id: string;
}) {
  return (
    <div className="bg-input/30 border">
      <div className="flex flex-row justify-between items-center p-4">
        <div className="flex flex-col">
          <p className="text-md font-bold">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch size="lg" id={id} />
      </div>
    </div>
  );
}

function LargeSettingButton({
  label,
  description,
  onClick,
  destructive = false,
}: {
  label: string;
  description: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <div
      className={cn("bg-input/30 border", destructive && "border-destructive")}
    >
      <div className="flex flex-row justify-between items-center p-4">
        <div className="flex flex-col">
          <p
            className={cn(
              "text-md font-bold",
              destructive && "text-destructive",
            )}
          >
            {label}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant={destructive ? "destructive" : "outline"}
          onClick={onClick}
          disabled
        >
          {label}
        </Button>
      </div>
    </div>
  );
}
