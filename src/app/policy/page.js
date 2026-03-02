import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import SectionTop from "@components/terms-policy/section-top-bar";
import PolicyArea from "@components/terms-policy/policy-area";

export const metadata = {
  title: "Privacy Policy - ProInfo.uz",
};

export default function Policy() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <SectionTop
        title="Privacy Policy"
        subtitle={
          <>
            Your privacy is important to us. ProInfo.uz is committed to protecting <br /> your personal information and respecting your privacy when you visit our website <br /> or use our library automation services.
          </>
        }
      />
      <PolicyArea />
      <Footer />
    </Wrapper>
  );
}
